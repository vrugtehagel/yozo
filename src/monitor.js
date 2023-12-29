import { warn } from './help.js' //
import { when } from './when.js'
import { Flow } from './flow.js'
import { live } from './live.js'


// This is where monitored contexts go
let context

// Set up a monitored context for certain types
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

export const until = thing => {
	if(!context) return thing
	// Okay, this is kind of magical, but it works.
	// It's a bit difficult for until() to "catch" the monitored context
	// and pick it back up, since the resolve handler we get to "go back
	// to" the function until()'s in queues a microtask.
	// For example,
	// 	await {then: resolve => {
	//		console.log('before resolve')
	//		resolve()
	//		console.log('after resolve')
	// 	}}
	//	console.log('after await')
	// this logs "before resolve", "after resolve", "after await" because
	// the resolve() function queues a microtask

	// Anyway, first of all, we need to stop the current monitored context
	const before = context
	// We don't need to remove the monitored context here with context = null
	// because until() calls and monitor() calls already "queue" this up

	// Now, return a manual then handler and normalize the "thing" argument
	// to be a promise.
	return {then: resolve => Promise.resolve(thing).then(result => {
		// This lets us abort function halfway through, pretty neat
		if(Object.keys(before).some(name => before[name].until?.())) return

		// Now, we queue three microtasks; one that restores the monitored
		// context, one that resumes the function, and one that stops the
		// monitored context after that.
		// It's okay if there are other microtasks at this point,
		// because we're queueing these three microtasks in a row.
		// It's impossible to shove a microtask in between any of these three.
		queueMicrotask(() => context = before)
		resolve(result)
		queueMicrotask(() => context = null)
	})}
}

// Basically equivalent to monitoring for nothing
// because it creates a new monitoring context until it returns
monitor.ignore = callback => monitor([], callback).result

// context holds the instances for registered classes, aggregating the
// monitored data. We can add an item by calling .add() on those
monitor.add = (name, ...things) => {
	if(!registrations[name]) warn`monitor-add-${name}-not-in-registry` //
	context?.[name]?.add(...things)
}

monitor.register = (name, registration) => {
	if(name == 'result') warn`monitor-cannot-register-result` //
	if(registrations[name]) warn`monitor-registry-already-has-${name}` //
	if(!registration?.toString().startsWith('class ')) //
		warn`monitor-${name}-definition-should-be-class` //
	registrations[name] ??= registration
}


// We can technically use monitor.register() to register 'live' and 'undo'
// but this is fewer bytes and does the same thing
const registrations = {
	// Prevent "result" from being registered because it's already used
	// for the return value of monitored calls
	result: true,

	// Monitor cleanup functions
	undo: class {
		#callbacks = []
		#stopped

		// This is what'll be returned from the monitor() calls
		result = () => {
			if(this.#stopped) return
			this.#callbacks.splice(0).map(callback => callback())
			this.#stopped = true
		}
		// add() is the only required method for these classes
		// The registrations would be kinda useless without it anyway
		add(callback){
			if(this.#stopped) return callback()
			this.#callbacks.push(callback)
		}
		// Stop until() calls from continuing if the call has been undone
		until(){ return this.#stopped }
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
			// Ignore the flow set up to listen to the monitored event
			// I don't remember what happens if we don't do this but it's
			// probably going to be weird monitoring bugs
			monitor.ignore(() => when($live).does(type))
				.then(() => this.result.dispatchEvent(new CustomEvent('change')))
		}
	}
}
