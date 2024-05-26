import { warn } from './help.js' //
import { when } from './when.js'
import { Flow } from './flow.js'
import { live } from './live.js'


// This is where monitored contexts go
let context

/**
 * Set up a monitored context for certain types.
 * {@link https://yozo.ooo/docs/monitor/}
 */
export const monitor = (names, callback) => {
	// We need to be mindful of the current monitored context
	// and restore it after this one is done
	const before = context

	// This is where the aggregation happens, and is internal
	context = {}
	// This is what'll be returned, the final aggregated data
	const call = {}
	names.map(name => {
		context[name] = new (registrations[name])
		call[name] = context[name].result
	})

	// During the callback(), there may be calls to monitor.add()
	// Those are caught in context, which is already set up above
	call.result = callback()

	// Restore the "outer" monitored context before returning
	context = before

	return call
}

/**
 * Resumes the monitored context after its argument resolves.
 * {@link https://yozo.ooo/docs/monitor/until/}
 */
export const until = thing => {
	if(!context) return thing
	// It's a bit difficult for until() to "catch" the monitored context
	// and pick it back up. But we can do it by carefully scheduling microtasks.

	// We don't need to stop the monitored context here with context = null
	// because until() calls and monitor() calls already "queue" this up
	return new Promise(async resolve => {
		const before = context
		const result = await thing

		// This lets us abort function halfway through, pretty neat
		if(Object.keys(before).some(name => before[name].until?.())) return

		// Now, we queue three microtasks; one that restores the monitored
		// context, one that resumes the "outer" function, and one that
		// stops the monitored context after that.
		// It's okay if there are other microtasks at this point,
		// because we're queueing these three microtasks in a row.
		// It's impossible to shove a microtask in between any of these three.
		// A key element to that is that resolve() doesn't execute any code
		// by itself, it just schedules a microtask that resolves the promise.
		queueMicrotask(() => context = before)
		resolve(result)
		queueMicrotask(() => context = null)
	})
}

/**
 * Ignore the current monitored context for the duration of the callback.
 * {@link https://yozo.ooo/docs/monitor/ignore/}
 */
monitor.ignore = callback => monitor([], callback).result

/**
 * Adds an item of a certain type to the current monitored context.
 * {@link https://yozo.ooo/docs/monitor/add/}
 */
monitor.add = (name, ...things) => {
	if(!registrations[name]) warn`monitor-add-${name}-not-in-registry` //
	context?.[name]?.add(...things)
}

/**
 * Register a new type to be monitored.
 * {@link https://yozo.ooo/docs/monitor/register/}
 */
monitor.register = (name, registration) => {
	if(name == 'result') warn`monitor-should-not-register-result` //
	if(registrations[name]) warn`monitor-registry-already-has-${name}` //
	if(!registration?.toString().startsWith('class ')) //
		warn`monitor-${name}-definition-should-be-class` //
	registrations[name] ??= registration
}


// We can technically use monitor.register() to register 'live' and 'undo'
// but this is fewer bytes and does the same thing
const registrations = {
	// Monitor cleanup functions
	undo: class {
		#callbacks = []

		// This is what'll be returned from the monitor() calls
		result = () => {
			this.#callbacks?.map(callback => callback())
			this.#callbacks = null
		}
		// add() is the only required method for these classes
		// The registrations would be kinda useless without it anyway
		add(callback){
			return this.#callbacks?.push(callback) ?? callback()
		}
		// Stop until() calls from continuing if the call has been undone
		until(){ return !this.#callbacks }
	},

	// Monitor use of live variables for different event types
	live: class {
		// Cache of live variable to array of used types
		#cache = new Map
		result = new EventTarget
		add($live, type){
			const cache = this.#cache.get($live) ?? []
			if(cache.includes(type)) return
			cache.push(type)
			this.#cache.set($live, cache)
			$live.addEventListener(type, () =>
				this.result.dispatchEvent(new CustomEvent('change'))
			)
		}
	}
}
