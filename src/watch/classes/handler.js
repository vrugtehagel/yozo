import Variable from './variable.js'
import Reference from './reference.js'
import isSame from '../functions/is-same.js'
import addToWatch from '../functions/add-to-watch.js'

export default class Handler {
    constructor(reference){
        this.reference = reference
    }

    get(target, key){
        if(key == Reference.symbol) return this.reference
        if(!this.reference.reader[key])
            return new Reference(this.reference, key).proxy
        addToWatch(this.reference.proxy)
        return this.reference.reader[key]()
    }

    set(target, key, value){
        this.reference.proxy[key].set(value)
        return true
    }

    deleteProperty(target, key){
        this.reference.proxy[key].delete()
        return true
    }

    apply(target, thisArg, args){
        const {object, key, parent} = this.reference
        if(key in Variable.prototype)
            return parent.variable[key](...args)
        addToWatch(parent.proxy)
        if(!parent.isRoot && !parent.isObject)
            return parent.value[key](...args)
        const oldObject = {...object}
        const result = parent.value[key](...args)
        const newObject = parent.value
        const keys = new Set(Object.keys(newObject))
        for(const key of Object.keys(oldObject)) keys.add(key)
        for(const key of keys){
            if(isSame(oldObject[key], newObject[key])) continue
            parent.dispatchChange()
            break
        }
        return result
    }

    ownKeys(target){
        addToWatch(this.reference.proxy)
        return this.reference.isObject ? Object.keys(this.reference.value) : []
    }

    has(target, key){
        addToWatch(this.reference.proxy)
        return this.reference.isObject && key in this.reference.value
    }

    getPrototypeOf(target){
        addToWatch(this.reference.proxy)
        return Variable.prototype
    }

    getOwnPropertyDescriptor(target, key){
        addToWatch(this.reference.proxy)
        if(!this.reference.isObject) return
        return {configurable: true, enumerable: true}
    }

}
