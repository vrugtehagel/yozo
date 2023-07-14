export const S = Symbol()
export const R = Symbol()

export const uniqueName = () => `_${camelCase(crypto.randomUUID())}`

export const camelCase = string => string.replace(/-+(\w)?/g,
	(full, character = '') => character?.toUpperCase())

export const kebabCase = string =>
	string.replace(/[A-Z]/g, '-$&').toLowerCase()
