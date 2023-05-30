const isMatcher = Symbol()
const matcher = definition => (...args) => ({
	[isMatcher]: true,
	is: value => definition(value, ...args)
})

matcher.resolve = thing => thing?.[isMatcher] ? thing : match(thing)
const isObject = thing => typeof thing == 'object' && thing != null

export const strictly = matcher((value, thing) => value === thing)
export const loosely = matcher((value, thing) => value == thing)
export const instance = matcher((value, type) => value instanceof type)
export const not = matcher((value, thing) => !matcher.resolve(thing).is(value))
export const truthy = matcher(value => value)
export const falsy = matcher(value => !value)
export const atLeast = matcher((value, thing) => value >= thing)
export const atMost = matcher((value, thing) => value <= thing)
export const either = matcher((value, ...matchers) => {
	return matchers.some(matcher => matcher.is(value))
})
export const both = matcher((value, ...matchers) => {
	return matchers.every(matcher => matcher.is(value))
})
export const subset = matcher((value, thing) => {
	if(!isObject(thing) || !isObject(value)) return loosely(thing).is(value)
	return Object.keys(value).every(key =>
		(thing[key][isMatcher] ? thing[key] : subset(thing[key])).is(value[key]))
})
export const superset = matcher((value, thing) => {
	if(!isObject(thing) || !isObject(value)) return loosely(thing).is(value)
	return Object.keys(thing).every(key => 
		(thing[key][isMatcher] ? thing[key] : superset(thing[key])).is(value[key]))
})
export const match = matcher((value, thing) => {
	if(!isObject(thing) || !isObject(value)) return loosely(thing).is(value)
	return Object.keys(value).every(key =>
		(thing[key][isMatcher] ? thing[key] : match(thing[key])).is(value[key]))
})

export class Test {
	static #records = new WeakMap

	static record(object, key, implementation){
		this.restore(object[key])
		if(typeof object[key] != 'function') return
		const original = object[key]
		implementation ??= function(original, ...args){
			return original.apply(this, args)
		}
		const records = []
		object[key] = new Proxy(original, {
			apply(target, thisArg, args){
				records.push({thisArg, args})
				return implementation.call(thisArg, original, ...args)
			}
		})
		this.#records.set(object[key], {original, object, key, records})
	}

	static restore(recorded){
		if(!this.#records.has(recorded)) return
		const {original, object, key} = this.#records.get(recorded)
		object[key] = original
	}
	static call = (value, position) => this.#records.get(value)?.records[position]

	#results = []

	report(){
		return [...this.#results]
	}

	confirm(value){
		return ({is: thing => message => {
			if(!matcher.resolve(thing).is(value))
				this.#results.push({type: 'error', message})
		}})
	}

	suppose(value){
		return ({is: matcher => message => {
			if(!matcher.resolve(thing).is(value))
				this.#results.push({type: 'warning', message})
		}})
	}
}

export const call = (value, position) => Test.call(value, position)

