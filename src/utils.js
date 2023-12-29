// Two main symbols are used.
// S is generally used for buckets of values or chaching
// and R is mostly used for registrations
export const S = Symbol()
export const R = Symbol()

// Also occasionally used for PascalCase through camelCase(`-${}`)
export const camelCase = string => string.replace(/-+(\w?)/g,
	(full, character) => character.toUpperCase())


// Takes objects with function values, and aggregates all of them
// into one object with function values
export const compose = objects => {
	// If we just start with {} then constructors cannot be aggregated
	// because result.constructor will be Object (and thus ??= will fail)
	const result = {constructor: null}
	for(const object of objects) for(const key of Object.keys(object))
		result[key] ??= function(...args){
			objects.map(object => object[key]?.call(this, ...args))
		}
	return result
}



