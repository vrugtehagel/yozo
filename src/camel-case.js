export default string =>
	string.replace(/-+\w/g, match => match.slice(-1).toUpperCase())
