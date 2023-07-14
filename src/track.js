import { error, warn, warnOnce } from './help.js' //
import { S, R } from './utils.js'
import { when } from './when.js'
import { Flow } from './flow.js'
import { live } from './live.js'


export const track = (names, callback) => {
	const before = track[S]
	track[S] = {}
	const call = {}
	for(const name of names)
		call[name] = (track[S][name] = new (track[R][name])).result
	call.result = callback()
	track[S] = before
	return call
}

export const until = thing => {
	if(!track[S]) return thing
	const before = track[S]
	track[S] = null
	return {then: resolve => Promise.resolve(thing).then(result => {
		if(Object.keys(before).some(name => before[name].until?.())) return
		queueMicrotask(() => track[S] = before)
		return resolve(result)
	})}
}

track.ignore = callback => track([], callback).result

track.add = (name, thing) => {
	if(!track[R][name]) warn`track-add-${name}-not-in-registry` //
	track[S]?.[name]?.add(thing)
}

track[R] = {result: true}
track.register = (name, registration) => {
	if(name == 'result') warn`track-cannot-register-result` //
	if(track[R][name]) warn`track-registry-already-has-${name}` //
	if(track[R][name]) return
	if(track[name]) warn`track-shorthand-${name}-not-created` //
	track[R][name] ??= registration
	track[name] ??= callback => track([name], callback)
}

track.register('flows', class {
	#stopped
	result = new Flow().if(() => null).cleanup(() => this.#stopped = true)
	add(flow){ this.result.or(flow) }
	until(){ return this.#stopped }
})

track.register('live', class {
	[R] = new WeakSet
	result = new EventTarget
	add($thing){
		if(this[R].has($thing)) return
		this[R].add($thing)
		track.ignore(() => when($thing).change())
			.then(() => this.result.dispatchEvent(new CustomEvent('change')))
	}
})
