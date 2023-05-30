import { addToWatch } from './add-to-watch.js'
import { symbol } from './symbol.js'

export class Reference {
	constructor(parent, key, root){
		const cache = {}
		this.parent = parent
		this.key = key
		this.isRoot = !root
		this.root = root ?? this
		if(root) this.root.bucket.add(new WeakRef(this))
		else this.bucket = new Set
		this.value = this.#forceGetValue()
		this.out = new Proxy(new EventTarget, {
			get: (target, key) => {
				if(key == symbol) return this
				if(key[0] == '$') return cache[key] ??= new Reference(this, key.slice(1), this.root).out
				if(key == Symbol.toPrimitive && !this.isObject || key == 'valueOf' || key == 'toJSON'){
					addToWatch(this.out)
					return () => this.value
				}
				if(key == 'toString'){
					addToWatch(this.out)
					return () => `${this.value}`
				}
				if(target[key]) return (...args) => target[key](...args)
				addToWatch(this.out[`$${key}`])
				return this.value?.[key]
			},
			set: (target, key, value) => {
				watch.set(this.out[key[0] == '$' ? key : `$${key}`], value)
				return true
			},
			deleteProperty: (target, key) => {
				watch.delete(this.out[key[0] == '$' ? key : `$${key}`])
				return true
			},
			ownKeys: () => {
				addToWatch(this.out)
				return this.isObject ? Object.keys(this.value) : []
			},
			has: (target, key) => {
				addToWatch(this.out)
				return this.isObject && key in this.value
			},
			getPrototypeOf: () => EventTarget.prototype,
			getOwnPropertyDescriptor: () => {
				addToWatch(this.out)
				if(!this.isObject) return
				return {configurable: true, enumerable: true}
			}
		})
	}

	get isObject(){ return this.value && typeof this.value == 'object' }

	do(callback){
		callback()
		this.#dispatchChange(this.#getChange())
	}

	#forceGetValue(){
		return (this.isRoot
			? this.parent.value
			: this.parent.#forceGetValue()
		)?.[this.key]
	}

	#getChange(){
		const value = this.#forceGetValue()
		const oldValue = this.value
		this.value = value
		return {value, oldValue}
	}

	#dispatchChange(change, info){
		if(change && change.oldValue === change.value) return
		const single = !!info
		info ??= {
			$parent: this.parent?.out ?? null,
			key: this.isRoot ? null : this.key,
			$source: this.out
		}
		change ??= this.#getChange()
		const detail = {...info, ...change}
		this.out.dispatchEvent(new CustomEvent('change', {detail}))
		if(single) return
		const changes = new Map
		const all = new Set([this.root])
		for(const weak of this.root.bucket){
			const reference = weak.deref()
			if(!reference){
				this.root.bucket.delete(weak)
				continue
			}
			const change = reference.#getChange()
			if(change.oldValue !== change.value || reference == this)
				changes.set(reference, change)
			else continue
			let current = reference
			while(!current.isRoot){
				all.add(current)
				current = current.parent
			}
		}
		for(const reference of all) if(reference != this)
			reference.#dispatchChange(changes.get(reference), info)
	}

}
