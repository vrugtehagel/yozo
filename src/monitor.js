import { warn } from './help.js' //
import { S, R } from './utils.js'
import { when } from './when.js'
import { Flow } from './flow.js'
import { live } from './live.js'


export const monitor = (names, callback) => {
	const before = monitor[S]
	monitor[S] = {}
	const call = {}
	names.map(name => {
		monitor[S][name] = new (monitor[R][name])
		call[name] = monitor[S][name].result
	})
	call.result = callback()
	monitor[S] = before
	return call
}

export const until = thing => {
	if(!monitor[S]) return thing
	const before = monitor[S]
	monitor[S] = null
	return {then: resolve => Promise.resolve(thing).then(result => {
		if(Object.keys(before).some(name => before[name].until?.())) return
		queueMicrotask(() => monitor[S] = before)
		resolve(result)
		queueMicrotask(() => monitor[S] = null)
	})}
}

monitor.ignore = callback => monitor([], callback).result

monitor.add = (name, ...things) => {
	if(!monitor[R][name]) warn`monitor-add-${name}-not-in-registry` //
	monitor[S]?.[name]?.add(...things)
}

monitor.register = (name, registration) => {
	if(name == 'result') warn`monitor-cannot-register-result` //
	if(monitor[R][name]) warn`monitor-registry-already-has-${name}` //
	monitor[R][name] ??= registration
}

monitor[R] = {
	result: true,
	undo: class {
		[R] = []
		#stopped
		result = () => {
			if(this.#stopped) return
			this[R].splice(0).map(callback => callback())
			this.#stopped = true
		}
		add(callback){
			if(this.#stopped) return callback()
			this[R].push(callback)
		}
		until(){ return this.#stopped }
	},
	live: class {
		[R] = new Map
		result = new EventTarget
		add($live, type){
			const cache = this[R].get($live) ?? []
			if(cache.includes(type)) return
			cache.push(type)
			this[R].set($live, cache)
			monitor.ignore(() => when($live).does(type))
				.then(() => this.result.dispatchEvent(new CustomEvent('change')))
		}
	}
}
