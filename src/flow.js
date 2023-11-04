import { warn } from './help.js' //
import { track } from './track.js'

export class Flow {
	#steps = []
	#cleanup = []
	#stopped
	#stopping
	#stopIndex

	constructor(callback){
		track.add('undo', () => this.stop())
		callback?.((...args) => {
			if(this.#stopped) warn`flow-stopped-but-triggered` //
			this.now(...args)
		})
	}

	flow(callback){
		this.#steps.push(callback)
		return this
	}

	now(...args){
		let index = -1
		const next = () => {
			if(this.#stopped) return
			index++
			if(index < this.#stopIndex) return
			if(this.#stopping) this.#stopIndex = index + 1
			if(this.#steps.length + 1 == this.#stopIndex) this.stop()
			this.#steps[index]?.(next, ...args)
		}
		next()
		return this
	}

	then(callback){
		return this.flow((next, ...args) => {
			callback(...args)
			next()
		})
	}

	await(callback){
		return this.flow(async (next, ...args) => {
			await callback(...args)
			next()
		})
	}

	if(callback){
		return this.flow((next, ...args) => {
			if(callback(...args)) next()
		})
	}

	or(flow){
		flow.then((...args) => this.now(...args))
		return this.cleanup(() => flow.stop?.())
	}

	stop(){
		if(this.#stopped) return
		this.#stopped = true
		this.#steps.splice(0)
		this.#cleanup.splice(0).map(callback => callback())
		return this
	}

	until(thing){
		if(typeof thing == 'function')
			return this.flow((next, ...args) => thing(...args) ? this.stop() : next())
		this.cleanup(() => thing.stop?.())
		thing.then(() => this.stop())
		return this
	}

	cleanup(callback){
		if(this.#stopped) callback()
		else this.#cleanup.push(callback)
		return this
	}

	once(){
		return this.then(() => this.#stopping = true)
	}

	debounce(duration){
		let id
		return this.flow(next => {
			clearTimeout(id)
			id = setTimeout(next, duration)
		}).cleanup(() => clearTimeout(id))
	}

	throttle(duration){
		let queued
		let id
		return this.flow(next => {
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
