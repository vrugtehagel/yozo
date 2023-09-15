import { error, warn, warnOnce } from './help.js' //
import { Flow } from './flow.js'
import { when } from './when.js'
import { effect } from './effect.js'
import { track } from './track.js'
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
		this.__weak = new WeakRef(this)
		this.__cache = new Map
		this.__$value = new Proxy(new EventTarget, {
			get: (target, key) => {
				if(key == Symbol.iterator){
					access(key) //
					return () => {
						track.add('live', this.__$value, 'keychange')
						return [...this.__value].map((thing, index) => this.__cached(index).__$value)[Symbol.iterator]()
					}
				}
				if(key[0] == '$') return this.__cached(key.slice(1)).__$value
				access(key) //
				if(target[key]) return target[key].bind(target)
				track.add('live', this.__cached(key).__$value, 'change')
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
				track.add('live', this.__$value, 'keychange')
				return this.__value != null && target[key] || key in this.__value
			},
			ownKeys: () => {
				track.add('live', this.__$value, 'keychange')
				return Object.keys(this.__value ?? {})
			},
			getOwnPropertyDescriptor: () =>
				({ configurable: true, enumerable: true }),
			defineProperty: () => false
		})
		live[R].set(this.__$value, this)
		if(root == this) roots.set(this, new Set)
		roots.get(root).add(this.__weak)
		this.__exists = this.__key in (this.__parent.__value ?? {})
		this.__value = this.__parent.__value?.[this.__key]
	}

	__cached(key){
		const cachedCore = this.__cache.get(key)?.deref()
		if(cachedCore) return cachedCore
		const core = new LiveCore(this, key, this.__root)
		this.__cache.set(key, core.__weak)
		return core
	}

	__alter(alteration, deepChanges = new Set){
		const result = alteration?.()
		const oldValue = this.__value
		const value = this.__parent.__value?.[this.__key]
		this.__value = value
		const existed = this.__exists
		const exists = this.__key in (this.__parent.__value ?? {})
		this.__exists = exists
		if(!Object.is(oldValue, value))
			this.__$value.dispatchEvent(new CustomEvent('change', {detail: {oldValue, value}}))
		if(existed != exists)
			this.__parent.__$value.dispatchEvent(new CustomEvent('keychange', {detail: {key: this.__key}}))
		let core = this
		while(!deepChanges.has(core) && core.__parent){
			deepChanges.add(core)
			core = core.__parent
		}
		if(Object.is(oldValue, value)) return result
		for(const [key, weak] of this.__cache){
			const core = weak.deref()
			if(core) core.__alter(null, deepChanges)
			else delete this.__cache[key]
		}
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
	track.add('live', $live, 'change')
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
		changing = false
	}
	const listener = when($live).change().then(({detail}) => {
		if(changing) return
		if(!options.set) return change(detail.oldValue)
		options.set(detail.value)
		change(track.ignore(options.get))
	})
	change(track.ignore(options.get))
	return (options.changes ?? new Flow)
		.then(() => change(track.ignore(options.get)))
		.if(() => null)
		.cleanup(() => listener.stop())
}
