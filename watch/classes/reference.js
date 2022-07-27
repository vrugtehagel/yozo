import watch from '../index.js'
import Handler from './handler.js'
import Reader from './reader.js'
import Variable from './variable.js'

export default class Reference {
    static symbol = Symbol()
    static roots = new Map
    static children = new WeakMap
    cache

    handler = new Handler(this)
    reader = new Reader(this)
    variable = new Variable(this)

    constructor(parent, key, isRoot = false){
        const cache = Reference.children.get(parent)
        const reference = cache?.[key]
        if(reference) return reference
        if(cache) cache[key] = this
        else Reference.children.set(parent, {[key]: this})
        if(isRoot) Reference.roots.set(this, new Set([this]))
        else Reference.roots.get(parent.root).add(this)
        this.parent = parent
        this.key = key
        this.isRoot = isRoot
        this.root = isRoot ? this : parent.root
        this.proxy = new Proxy(() => {}, this.handler)
        this.cache = this.forceGetValue()
    }

    get object(){ return this.parent.value }
    get value(){ return this.cache }
    get isObject(){ return this.value && typeof this.value == 'object' }
    get isFree(){ return !this.isRoot && !this.parent.isObject }

    change(callback){
        callback()
        const change = this.getChange()
        this.dispatchChange(change)
    }

    forceGetValue(){
        if(this.isRoot) return this.parent.value?.[this.key]
        return this.parent.forceGetValue()?.[this.key]
    }

    getInfo(){
        const parent = this.parent?.proxy ?? null
        const key = this.isRoot ? null : this.key
        const source = this.proxy
        return {parent, key, source}
    }

    getChange(){
        const value = this.forceGetValue()
        const oldValue = this.cache
        this.cache = value
        return {value, oldValue}
    }

    dispatchChange(change, info){
        if(change && change.oldValue === change.value) return
        const single = Boolean(info)
        info ??= this.getInfo()
        change ??= this.getChange()
        const detail = {...info, ...change}
        this.variable.dispatchEvent(new CustomEvent('change', {detail}))
        if(single) return
        const references = new Set(Reference.roots.get(this.root))
        const changes = new Map
        const all = new Set
        for(const reference of references){
            const change = reference.getChange()
            if(change.oldValue !== change.value || reference == this)
                changes.set(reference, change)
            else continue
            let current = reference
            while(!current.isRoot){
                all.add(current)
                current = current.parent
            }
        }
        all.add(this.root)
        for(const reference of all){
            if(reference == this) continue
            const change = changes.get(reference)
            reference.dispatchChange(change, info)
        }
    }

}
