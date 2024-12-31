import { warn } from './help.js' //
import { monitor } from './monitor.js'

/**
 * A `Flow` object represents an arbitrary number of triggers.
 * {@link https://yozo.ooo/docs/flow/}
 */
export class Flow {
	#steps = []
	#cleanup = []
	#stopping
	#stopIndex

	/**
	 * Construct a `Flow` manually.
	 * {@link https://yozo.ooo/docs/flow/constructor/}
	 */
	constructor(callback){
		monitor.add('undo', () => this.stop())
		callback?.((...args) => {
			if(!this.#steps) warn`flow-stopped-but-triggered` //
			this.now(...args)
		})
	}

	/**
	 * Add a custom callback to the callback pipeline.
	 * {@link https://yozo.ooo/docs/flow/pipe/}
	 */
	pipe(callback){
		this.#steps?.push(callback)
		return this
	}

	/**
	 * Trigger a flow with certain trigger arguments.
	 * {@link https://yozo.ooo/docs/flow/now/}
	 */
	now(...args){
		let index = -1
		const next = () => {
			if(!this.#steps) return
			index++
			if(index < this.#stopIndex) return
			if(this.#stopping) this.#stopIndex = index + 1
			if(this.#steps.length + 1 == this.#stopIndex) this.stop()
			this.#steps?.[index]?.(next, ...args)
		}
		next()
		return this
	}

	/**
	 * Run a callback when the `Flow` triggers.
	 * {@link https://yozo.ooo/docs/flow/then/}
	 */
	then(callback){
		const isAwaited = callback.toString().includes('[native code]') //
		return this.pipe((next, ...args) => {
			if(!this.#stopping && isAwaited) warn`flow-awaited-without-once` //
			callback(...args)
			next()
		})
	}

	/**
	 * Run a callback when the `Flow` triggers and await its result.
	 * {@link https://yozo.ooo/docs/flow/await/}
	 */
	await(callback){
		return this.pipe(async (next, ...args) => {
			await callback(...args)
			next()
		})
	}

	/**
	 * Conditionally let the trigger pass to the next callback in the pipeline
	 * {@link https://yozo.ooo/docs/flow/if/}
	 */
	if(callback){
		return this.pipe((next, ...args) => {
			if(callback(...args)) next()
		})
	}

	/**
	 * Add the triggers from another flow into this one.
	 * {@link https://yozo.ooo/docs/flow/or/}
	 */
	or(flow){
		flow.then((...args) => {
			this.now(...args)
		})
		return this.cleanup(() => flow.stop?.())
	}

	/**
	 * Stop a flow and run its cleanup callbacks.
	 * {@link https://yozo.ooo/docs/flow/stop/}
	 */
	stop(){
		if(this.#steps)
			this.#cleanup.splice(0).map(callback => callback())
		this.#steps = null
		return this
	}

	/**
	 * Stop a flow, depending on trigger arguments or another thenable.
	 * {@link https://yozo.ooo/docs/flow/until/}
	 */
	until(thing){
		if(typeof thing == 'function')
			return this.pipe((next, ...args) => thing(...args) ? this.stop() : next())
		this.cleanup(() => thing.stop?.())
		thing.then(() => this.stop())
		return this
	}

	/**
	 * Define a cleanup callback for the flow, to be run when it stops.
	 * {@link https://yozo.ooo/docs/flow/cleanup/}
	 */
	cleanup(callback){
		if(this.#steps) this.#cleanup.push(callback)
		else callback()
		return this
	}

	/**
	 * Allow only one trigger through, and clean up after it has finished.
	 * {@link https://yozo.ooo/docs/flow/once/}
	 */
	once(){
		return this.then(() => this.#stopping = true)
	}

	/**
	 * Debounce a flow's triggers with a certain duration.
	 * {@link https://yozo.ooo/docs/flow/debounce/}
	 */
	debounce(duration){
		let id
		return this.pipe(next => {
			clearTimeout(id)
			id = setTimeout(next, duration)
		}).cleanup(() => clearTimeout(id))
	}

	/**
	 * Throttle a flow's triggers with a certain duration.
	 * {@link https://yozo.ooo/docs/flow/throttle/}
	 */
	throttle(duration){
		let queued
		let id
		return this.pipe(next => {
			if(id) return queued = next
			next()
			id = setInterval(() => {
				if(!queued){
					clearTimeout(id)
					id = 0
					return
				}
				queued()
				queued = null
			}, duration)
		}).cleanup(() => clearTimeout(id))
	}

	/**
	 * Execute code that may trigger the flow itself.
	 * {@link https://yozo.ooo/docs/flow/after/}
	 */
	after(callback){
		queueMicrotask(() => queueMicrotask(callback))
		return this
	}

}
