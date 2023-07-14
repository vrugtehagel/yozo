import { warn, warnOnce } from './help.js' //
import { Flow } from './flow.js'
import { when } from './when.js'
import { effect } from './effect.js'
import { track } from './track.js'
import { R } from './utils.js'


export const live = thing =>
	new LiveCore({__value: {$: live.get(thing)}}, '$').__$value

live[R] = new WeakMap

const roots = new WeakMap
class LiveCore {
	constructor(parent, key, root){
		this.__parent = parent
		this.__key = key
		this.__root = root
		const cache = {}
		const cached = key =>
			cache[key] ??= new LiveCore(this, key, this.__root ?? this).__$value
		this.__$value = new Proxy(new EventTarget, {
			get: (target, key) => {
				if(key == Symbol.iterator)
					return () => Object.keys(live.get(this.__$value) ?? {}).map(cached)[key]()
				if(key[0] == '$') return cached(key.slice(1))
				if(target[key]) return target[key].bind(target)
				track.add('live', cached(key))
				return this.__value?.[key]
			},
			set: (target, key, value) => {
				if(key[0] == '$') warn`live-property-set-${key}-has-$` //
				return live.set(cached(key), value)
			},
			deleteProperty: (target, key, value) => {
				if(key[0] == '$') warn`live-property-delete-${key}-has-$` //
				return live.delete(cached(key))
			},
			has: (target, key) => {
				track.add('live', this.__$value)
				return this.__value != null && key in this.__value || key in target
			},
			ownKeys: () => {
				track.add('live', this.__$value)
				return Object.keys(this.__value ?? {})
			},
			getOwnPropertyDescriptor: () =>
				({ configurable: true, enumerable: true }),
			defineProperty: () => false
		})
		live[R].set(this.__$value, this)
		if(!root) roots.set(this, new Set)
		roots.get(root ?? this).add(new WeakRef(this))
		this.__value = this.__get()
	}

	__get(){
		return (this.__root
			? this.__parent.__get()
			: this.__parent.__value
		)?.[this.__key]
	}

	__modify(callback){
		const result = callback(this.__parent.__value, this.__key)
		this.__dispatch(this.__detail())
		return result
	}

	__detail(){
		const oldValue = this.__value
		const value = this.__get()
		this.__value = value
		return {value, oldValue}
	}

	__dispatch(detail, $source){
		if(detail && Object.is(detail.oldValue, detail.value)) return
		const value = this.__value
		const key = this.__key
		detail ??= {value, oldValue: value}
		this.__$value.dispatchEvent(new CustomEvent('change', {detail}))
		if($source) return
		const changes = new Map
		const root = this.__root ?? this
		const all = new Set
		for(const weak of roots.get(root)){
			const core = weak.deref()
			if(!core){
				roots.get(root).delete(weak)
				continue
			}
			const detail = core.__detail()
			if(!Object.is(detail.oldValue, detail.value))
				changes.set(core, detail)
			else if(core != this) continue
			let bubbled = core
			while(bubbled.__parent){
				all.add(bubbled)
				bubbled = bubbled.__parent
			}
		}
		for(const core of all)
			if(core != this) core.__dispatch(changes.get(core), this.__$value)
	}
}

live.get = ($live, key) => {
	if(!live[R].has($live)) return key == null ? $live : $live[key]
	if(key != null) return key[0] == '$' ? live.get($live[`$${key}`]) : $live[key]
	track.add('live', $live)
	return live[R].get($live).__value
}

live.set = ($live, value) => {
	return !!live[R].get($live)?.__modify((parent, key) => {
		if(parent == null) return false
		parent[key] = live.get(value)
		return true
	})
}

live.delete = $live => {
	return !!live[R].get($live)?.__modify((parent, key) => {
		if(parent == null) return false
		return delete parent[key]
	})
}

live.link = ($live, options) => {
	if(options instanceof EventTarget){
		const input = options
		options = {
			get: () => input.value,
			set: value => input.value = value,
			changes: when(input).input()
		}
	}
	if(typeof options == 'function') options = {get: options}
	if(!options.changes){
		let cache
		const getter = options.get
		options.changes = effect(() => cache = getter(), update => update())
		options.get = () => cache
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
	change(options.get())
	return options.changes
		.then(() => change(track.ignore(options.get)))
		.if(() => null)
		.cleanup(() => listener.stop())
}
