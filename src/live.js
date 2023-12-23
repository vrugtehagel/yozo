import { error, warn, warnOnce } from './help.js' //
import { Flow } from './flow.js'
import { when } from './when.js'
import { effect } from './effect.js'
import { monitor } from './monitor.js'
import { R } from './utils.js'


export const live = thing =>
	new LiveCore({__value: {$: live.get(thing)}}, '$').__$value

live[R] = new WeakMap
const roots = new WeakMap
const access = async key => { //
	access.recent = key //
	await 'mircrotask' //
	access.recent = null //
} //

class LiveCore {
	constructor(parent, key, root = this){
		this.__parent = parent
		this.__key = key
		this.__root = root
		this.__cache = {}
		this.__$value = new Proxy(new EventTarget, {
			get: (target, key) => {
				if(key == Symbol.iterator){
					access(key) //
					return () => {
						if(!this.__value[key]) //
							error`live-property-${this.__key}-not-iterable` //
						monitor.add('live', this.__$value, 'keychange')
						return [...this.__value]
							.map((thing, index) => this.__cached(index).__$value)[key]()
					}
				}
				if(key[0] == '$') return this.__cached(key.slice(1)).__$value
				access(key) //
				if(target[key]) return target[key].bind(target)
				monitor.add('live', this.__cached(key).__$value, 'deepchange')
				return this.__value?.[key]
			},
			set: (target, key, value) => {
				if(key[0] == '$') warn`live-property-set-${key}-has-$` //
				return live.set(this.__cached(key).__$value, value)
			},
			deleteProperty: (target, key, value) => {
				if(key[0] == '$') warn`live-property-delete-${key}-has-$` //
				return live.delete(this.__cached(key).__$value)
			},
			has: (target, key) => {
				monitor.add('live', this.__$value, 'keychange')
				return this.__value != null && target[key] || key in this.__value
			},
			ownKeys: () => {
				monitor.add('live', this.__$value, 'keychange')
				return Object.keys(this.__value ?? {}).map(key => `$${key}`)
			},
			getOwnPropertyDescriptor: () => ({configurable: true, enumerable: true}),
			defineProperty: () => false
		})
		live[R].set(this.__$value, this)
		if(root == this) roots.set(this, new Set)
		roots.get(root).add(new WeakRef(this))
		this.__value = this.__parent.__value?.[this.__key]
		this.__keys = Object.keys(this.__value ?? {})
	}

	__cached(key){
		return this.__cache[key] ??= new LiveCore(this, key, this.__root)
	}

	__alter(alteration, deepChanges = new Set([this])){
		const result = alteration?.()
		const oldValue = this.__value
		const value = this.__parent.__value?.[this.__key]
		this.__value = value
		if(!Object.is(oldValue, value))
			this.__$value.dispatchEvent(new CustomEvent('change', {detail: {oldValue, value}}))
		const keys = Object.keys(this.__value ?? {})
		const diff = new Set(this.__keys)
		this.__keys = keys
		for(const key of keys)
			if(diff.has(key)) diff.delete(key)
			else diff.add(key)
		if(diff.size)
			this.__$value.dispatchEvent(new CustomEvent('keychange', {detail: {keys: [...diff]}}))
		let core = this.__parent
		deepChanges.add(this)
		while(!deepChanges.has(core) && core.__parent){
			core.__alter(null, deepChanges)
			deepChanges.add(core)
			core = core.__parent
		}
		if(Object.is(oldValue, value)) return result
		for(const core of Object.values(this.__cache))
			core.__alter(null, deepChanges)
		if(!alteration) return
		for(const core of deepChanges)
			core.__$value.dispatchEvent(new CustomEvent('deepchange'))
		return result
	}
}

live.get = ($live, key) => {
	const core = live[R].get($live)
	if(!core) return key == null ? $live : $live[key]
	access(key == null ? core.__key : key) //
	if(key != null) return core.__cached(key).__value
	monitor.add('live', $live, 'deepchange')
	return core.__value
}

live.set = ($live, value) => {
	const core = live[R].get($live)
	return !!core?.__alter(() => {
		if(core.__parent.__value == null) return false
		core.__parent.__value[core.__key] = live.get(value)
		return true
	})
}

live.delete = ($live, value) => {
	const core = live[R].get($live)
	return !!core?.__alter(() => {
		if(core.__parent.__value == null) return false
		return delete core.__parent.__value[core.__key]
	})
}

live.link = ($live, thing) => {
	if(!live[R].has($live)) //
		if(access.recent) error`live-link-target-${access.recent}-not-live` //
		else error`live-link-target-not-live` //
	let cache
	let options = thing
	if(thing instanceof HTMLElement){
		options = {
			get: () => thing.value,
			set: value => thing.value = value,
			changes: when(thing).input()
		}
	} else if(typeof thing == 'function'){
		options = {
			get: () => cache,
			changes: effect(() => cache = thing(), update => update())
		}
	}

	let changing
	const change = value => {
		changing = true
		live.set($live, value)
		cache = value
		changing = false
	}
	const listener = when($live).deepchange().then(() => {
		if(changing) return
		if(!options.set) return change(cache)
		options.set(monitor.ignore(() => live.get($live)))
		change(monitor.ignore(options.get))
	})
	change(monitor.ignore(options.get))
	return (options.changes ?? new Flow)
		.then(() => change(monitor.ignore(options.get)))
		.if(() => null)
		.cleanup(() => listener.stop())
}
