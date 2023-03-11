export default function sourceMap(input, filename){
	const version = 3
	const sources = [filename]
	const mappings = getMappings(input)
	const sourcesContent = [input]
	const sourceMap = {version, sources, mappings, sourcesContent}
	const base64 = btoa(JSON.stringify(sourceMap))
	const url = `data:application/json;base64,${base64}`
	return `//# sourceMappingURL=${url}`
}
