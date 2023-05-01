import { when } from './when.js'

let current

export const track = (names, fn) => {
	const before = current
	current = {}
	for(const name of names) current[name] = new registry[name]
	const call = {}
	for(const name of names) call[name] = current[name].result
	call.result = fn()
	current = before
	return call
}

export const until = thing => {
	const before = current
	current = null
	return {then: resolve => Promise.resolve(thing).then(result => {
		if(Object.keys(before).some(name => before[name].until?.())) return
		queueMicrotask(() => current = before)
		return resolve(result)
	})}
}

track.ignore = fn => {
	const before = current
	current = null
	const result = fn()
	current = before
	return result
}

track.define = definition => (...args) => {
	const {result, ...call} = definition(...args)
	for(const [key, value] of Object.entries(call)) current?.[key]?.add(value)
	return result
}

const registry = {}
track.register = (name, definition) => {
	if(name == 'result') return
	registry[name] ??= definition
	track[name] ??= fn => track([name], fn)
}

track.register('undo', class {
	#undone
	#undos = []
	result = () => {
		this.#undone = true
		this.#undos.splice(0).forEach(track.ignore)
	}
	until(){ return this.#undone }
	add(undo){ this.#undone ? undo() : this.#undos.unshift(undo) }
})

track.register('watched', class {
	result = new EventTarget
	add($thing){
		track.ignore(() => when($thing).change())
			.then(() => this.result.dispatchEvent(new CustomEvent('change')))
	}
})
