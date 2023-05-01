import { errors } from './development/index.js' //
import { track } from './track.js'

export class Thenable {
	#pipeline = []
	#ors = []
	#cleanup = []
	#dead = false
	#stop
	#stopping = false

	constructor(callback = () => {}){
		track.define(() => {
			const call = callback((...args) => {
				// If this triggers, and the thenable is dead, something's wrong
				if(this.#dead) errors.warn('triggered-dead-thenable') //
				this.now(...args)
			})
			const undo = () => this.die()
			return {undo}
		})()
	}

	pipe(callback){
		this.#pipeline.push(callback)
		return this
	}

	now(...args){
		if(this.#stop) return
		let index = -1
		const next = () => {
			if(this.#dead) return
			index++
			if(index < this.#stop) return
			if(this.#stopping) this.#stop = index + 1
			if(!this.#pipeline[index]){
				if(this.#stop) return this.die()
				return
			}
			this.#pipeline[index](next, ...args)
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

	or(thenable){
		this.#ors.push(thenable)
		thenable.then((...args) => this.now(...args))
		return this
	}

	after(callback){
		queueMicrotask(() => queueMicrotask(callback))
		return this
	}

	cleanup(callback){
		this.#cleanup.push(callback)
		return this
	}

	die(){
		if(this.#dead) return
		this.#dead = true
		this.#pipeline.splice(0)
		this.#cleanup.splice(0).forEach(callback => callback())
		this.#ors.splice(0).forEach(thenable => thenable.die?.())
		return this
	}

	until(thing){
		if(typeof thing == 'function')
			return this.pipe((next, ...args) => thing(...args) ? this.die() : next())
		thing.once?.()
		thing.then(() => { this.die() })
		return this
	}

	once(){
		if(this.#stopping) return this
		return this.then(() => this.#stopping = true)
	}

	debounce(duration){
		let id = 0
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

}
