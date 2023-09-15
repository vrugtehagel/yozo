import '/-/js/service-worker/index.js'
import { ContextMessenger } from '/-/js/context-messenger/index.js'

const {live, when} = self.yozo

const messenger = new ContextMessenger('web-server')
const $scopes = live([])
const files = new Map

when(messenger).filerequests().then(event => {
	const {src} = event.detail.payload
	if(!$scopes.some(scope => src.startsWith(scope))) return
	const body = files.get(src)
	event.detail.respond(body ?? null)
})
when(messenger).scopeclaims().then(event => {
	const {scope} = event.detail.payload
	const index = $scopes.indexOf(scope)
	if(index == -1) return
	$scopes.splice(index, 1)
})


export function claim(scope){
	messenger.send('scopeclaim', {scope})
	$scopes.push(scope)
}

export function claimed(scope){
	return $scopes.includes(scope)
}

export function extension(src = ''){
	if(!src.includes('.')) return ''
	const extension = src.split('.').at(-1)
	if(/\W/.test(extension)) return ''
	return extension
}

export function upload(...entries){
	for(const {src, body} of entries) files.set(src, body)
}

export function clear(scope){
	for(const [src] of files)
		if(src.startsWith(scope)) files.delete(src)
}
