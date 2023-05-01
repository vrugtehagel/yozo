export const camelCase = string =>
	string.replace(/-+\w/g, match => match.slice(-1).toUpperCase())

export const kebabCase =  string =>
	string.replace(/([A-Z])/g, '-$1').toLowerCase()
