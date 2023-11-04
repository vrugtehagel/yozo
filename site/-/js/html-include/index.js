// insert some stuff into the head of an HTML string
// This is not as easy as just DOMParser + XMLSerializer,
// because the latter escapes characters even in style and script tags
// So, regexes it is :/

const doctypes = [
	/^<!DOCTYPE +html *>/i,
	/^<!DOCTYPE +html +PUBLIC +(["'])[-\w./ ]\1 +(?:(["'])[-\w./:]\2) *>/i,
	/^<!DOCTYPE +html +SYSTEM +(["'])about:legacy-compat\1 *>/
]
const comment = /^<!--[^]*?-->/
const openTag = /^<([a-z]+)\s*(?:[^>]*(["'])[^]*?\2)*[^"']*?>/i

function consumeComments(string){
	string = string.trimStart()
	for(let length = Infinity; length > string.length; length = string.length)
		string = string.replace(comment, '').trimStart()
	return string
}

function consumeDoctype(string){
	string = string.trimStart()
	for(const doctype of doctypes)
		string = string.replace(doctype, '').trimStart()
	return string
}

function consumeTag(tag, string){
	const match = string.trimStart().match(openTag)
	if(!match) return string
	const [full, name] = match
	if(name.toLowerCase() != tag) return string
	return string.slice(full.length)
}

function consumeUntilHead(string){
	const original = string
	string = consumeComments(string)
	string = consumeDoctype(string)
	string = consumeComments(string)
	string = consumeTag('html', string)
	string = consumeComments(string)
	string = consumeTag('head', string)
	if(string == original && !openTag.test(string) && string != '')
		throw Error(`Malformed HTML "${string.slice(0, 20)}…"`)
	return string
}

export function htmlInclude(html, resources){
	try {
		const index = html.length - consumeUntilHead(html).length
		return html.slice(0, index) + resources + html.slice(index)
	} catch {
		return html
	}
}
