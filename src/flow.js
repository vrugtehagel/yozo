import { warn } from './help.js' //
import { monitor } from './monitor.js'


export class Flow {
	#steps = []
	#cleanup = []
	#stopping
	#stopIndex

	constructor(callback){
		monitor.add('undo', () => this.stop())
		callback?.((...args) => {
			if(!this.#steps) warn`flow-stopped-but-triggered` //
			this.now(...args)
		})
	}

	pipe(callback){
		this.#steps?.push(callback)
		return this
	}

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

	then(callback){
		return this.pipe((next, ...args) => {
			callback(...args)
			next()
		})
	}

	await(callback){
		return this.pipe(async (next, ...args) => {
			await callback(...args)
			next()
		})
	}

	if(callback){
		return this.pipe((next, ...args) => {
			if(callback(...args)) next()
		})
	}

	or(flow){
		flow.then((...args) => this.now(...args))
		return this.cleanup(() => flow.stop?.())
	}

	stop(){
		if(this.#steps)
			this.#cleanup.splice(0).map(callback => callback())
		this.#steps = null
		return this
	}

	until(thing){
		if(typeof thing == 'function')
			return this.pipe((next, ...args) => thing(...args) ? this.stop() : next())
		this.cleanup(() => thing.stop?.())
		thing.then(() => this.stop())
		return this
	}

	cleanup(callback){
		if(this.#steps) this.#cleanup.push(callback)
		else callback()
		return this
	}

	once(){
		return this.then(() => this.#stopping = true)
	}

	debounce(duration){
		let id
		return this.pipe(next => {
			clearTimeout(id)
			id = setTimeout(next, duration)
		}).cleanup(() => clearTimeout(id))
	}

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

	after(callback){
		queueMicrotask(() => queueMicrotask(callback))
		return this
	}

}
