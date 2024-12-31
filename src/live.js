import { error, warn, warnOnce } from './help.js' //
import { Flow } from './flow.js'
import { when } from './when.js'
import { effect } from './effect.js'
import { monitor } from './monitor.js'


// Live variables are just proxies
// The LiveCore class handles all the internals and creates the proxy

// This function just creates a root LiveCore and returns the proxy
// exposed by it through __$value
// The LiveCore constructor takes a parent as first argument and the key as
// second. The root ones obviously don't have parents so we're faking the
// parent LiveCore with just {__value: {$: …}}
// The $ key is not really required, could be anything

/**
 * Create a live variable.
 * {@link https://yozo.ooo/docs/live/}
 */
export const live = thing =>
	new LiveCore({__value: {$: live.get(thing)}}, '$').__$value

// Map for live variables to their LiveCore
const coreMap = new WeakMap

// Keep track of what was last accessed so we can give better error messages
const access = async key => { //
	access.recent = key //
	await 'microtask' //
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
				// This is for iterating a live variable directly
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

				// The "target" is just the EventTarget for this live variable
				if(target[key]) return target[key].bind(target)

				// Since a value was directly read, we add for 'deepchange' events
				monitor.add('live', this.__cached(key).__$value, 'deepchange')
				if(coreMap.has(this.__value?.[key])) //
					warnOnce`live-property-${key}-doubled` //
				return this.__value?.[key]
			},
			set: (target, key, value) => {
				if(key[0] == '$') warn`live-property-set-${key}-has-$` //
				// We use live.set() here, instead of using the setter for
				// live.set(), because live.set() sets the value of a live
				// variable itself whereas this sets the value for a property
				return live.set(this.__cached(key).__$value, value)
			},
			deleteProperty: (target, key, value) => {
				if(key[0] == '$') warn`live-property-delete-${key}-has-$` //
				return live.delete(this.__cached(key).__$value)
			},
			has: (target, key) => {
				// We're not actually reading the value at a key, only checking
				// to see if it exists. So we listen for 'keychange' events only
				monitor.add('live', this.__$value, 'keychange')
				return this.__value != null && key in this.__value || target[key]
			},
			ownKeys: () => {
				monitor.add('live', this.__$value, 'keychange')
				// Return dollar-prefixed versions here
				return Object.keys(this.__value ?? {}).map(key => `$${key}`)
			},
			getOwnPropertyDescriptor: () => ({configurable: true, enumerable: true}),
			// Not allowed!
			defineProperty: () => false
		})
		coreMap.set(this.__$value, this)
		this.__value = this.__parent.__value?.[this.__key]
		this.__keys = this.__value instanceof Object
			? Object.keys(this.__value ?? {})
			: []
	}

	__cached(key){
		return this.__cache[key] ??= new LiveCore(this, key, this.__root)
	}

	// Here is where we make changes and compare states to what things were before
	__alter(alteration, deepChanges = new Set()){
		const result = alteration?.()
		const oldValue = this.__value
		const value = this.__value = this.__parent.__value?.[this.__key]

		// Diffing the keys for keychange event
		const diff = new Set(this.__keys)
		this.__keys = this.__value instanceof Object
			? Object.keys(this.__value ?? {})
			: []
		for(const key of this.__keys)
			if(diff.has(key)) diff.delete(key)
			else diff.add(key)
		if(diff.size)
			this.__$value.dispatchEvent(new CustomEvent('keychange', {detail: {keys: [...diff]}}))

		// Comparison happens using Object.is because it's "better" than ===
		// Specifically around NaN and -0
		if(Object.is(oldValue, value)) return result
		else this.__$value.dispatchEvent(new CustomEvent('change', {detail: {oldValue, value}}))

		// Go up the tree to collect deepchanges
		let core = this
		while(!deepChanges.has(core) && core.__parent){
			core.__alter(null, deepChanges)
			deepChanges.add(core)
			core = core.__parent
		}

		// Also go around the object's properties for deepchanges
		for(const core of Object.values(this.__cache))
			core.__alter(null, deepChanges)

		// Since we call this function recursively, we need to filter out all
		// calls that didn't get an "alteration" argument,
		// which is all but the original call
		if(!alteration) return

		for(const core of deepChanges)
			core.__$value.dispatchEvent(new CustomEvent('deepchange'))
		return result
	}
}

/**
 * Unwrap a live variable to retrieve its value.
 * {@link https://yozo.ooo/docs/live/get/}
 */
live.get = ($live, key) => {
	const base = coreMap.get($live)
	if(!base) return key == null ? $live : $live[key]
	const core = key == null ? base : base.__cached(key)
	monitor.add('live', core.__$value, 'deepchange')
	access(core.__key) //
	if(coreMap.has(core.__value)) //
		warnOnce`live-property-${key}-doubled` //
	return core.__value
}

/**
 * Set the underlying value of a live variable.
 * {@link https://yozo.ooo/docs/live/set/}
 */
live.set = ($live, value) => {
	const core = coreMap.get($live)
	return !!core?.__alter(() => {
		if(core.__parent.__value == null) return false
		core.__parent.__value[core.__key] = live.get(value)
		return true
	})
}

/**
 * Delete a live variable from its parent object.
 * {@link https://yozo.ooo/docs/live/delete/}
 */
live.delete = ($live, value) => {
	const core = coreMap.get($live)
	return !!core?.__alter(() => {
		if(core.__parent.__value == null) return false
		return delete core.__parent.__value[core.__key]
	})
}

/**
 * Link a live variable to a a calculation, input element, or other data.
 * {@link https://yozo.ooo/docs/live/link/}
 */
live.link = ($live, thing) => {
	if(!coreMap.has($live)) //
		if(access.recent) error`live-link-target-${access.recent}-not-live` //
		else error`live-link-target-not-live` //
	// The "current" value, sometimes needs to be validated
	let cache
	let options = thing
	if(self.HTMLElement && thing instanceof HTMLElement){
		// Allow shorthand live.link($live, input)
		options = {
			get: () => thing.value,
			set: value => thing.value = value,
			changes: when(thing).input()
		}
	} else if(typeof thing == 'function'){
		// Also shorthand live.link($live, () => {…})
		options = {
			get: () => cache,
			changes: effect(() => cache = thing(), update => update())
		}
	}

	// The returned flow; it triggers when the link syncs, and kills the link
	// when stopped
	const flow = new Flow
	options.changes?.then(() => flow.now())

	// We need to listen to $live for changes, so we can appropriately respond
	// But we will also be changing $live here ourselves
	// So we set "changing" to true whenever it is us changing it right here
	let changing
	const change = value => {
		changing = true
		live.set($live, value)
		cache = value
		changing = false
	}
	const listener = () => {
		if(changing) return
		// if there's no setter, it's a readonly link, so change it back
		if(!options.set) return change(cache)
		// Avoid any getters or things like that from adding to the monitored
		// context. We return a flow with proper cleanup for removing the link
		// Basically, the link itself should not have any weird side effects.
		options.set(monitor.ignore(() => live.get($live)))
		change(monitor.ignore(options.get))
	}
	$live.addEventListener('deepchange', listener)
	change(monitor.ignore(options.get))
	return flow
		.then(() => change(monitor.ignore(options.get)))
		.cleanup(() => $live.removeEventListener('deepchange', listener))
}
