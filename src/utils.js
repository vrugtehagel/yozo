/**
 * Turn a kebab-case string into a camelCase one.
 * Also occasionally used for PascalCase through camelCase(`-${}`).
 */
export const camelCase = string => string.replace(/-+(\w?)/g,
	(full, character) => character.toUpperCase())

/**
 * Aggregates many objects with function values into one.
 */
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
