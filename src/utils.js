export const S = Symbol()
export const R = Symbol()

export const camelCase = string => string.replace(/-+(\w)?/g,
	(full, character = '') => character.toUpperCase())

export const compose = objects => {
	const result = {constructor: null}
	for(const object of objects) for(const key of Object.keys(object))
		result[key] ??= function(...args){
			objects.map(object => object[key]?.call(this, ...args))
		}
	return result
}
