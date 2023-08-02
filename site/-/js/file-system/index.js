import '/-/js/service-worker/index.js'
import { ContextMessenger } from '/-/js/context-messenger/index.js'

const {live, when} = self.yozo

export const $files = live({})
const $scopes = live([])

const messenger = new ContextMessenger('file-system')

when(messenger).filerequests().then(event => {
	const {scope, src} = event.detail.payload
	if(!$scopes.includes(scope)) return
	const entry = Object.values($files).find(entry => entry.src == src)
	const body = entry ? entry.body : null
	event.detail.respond(body)
})
when(messenger).scopeclaims().then(event => {
	const {scope} = event.detail.payload
	const index = $scopes.indexOf(scope)
	if(index == -1) return
	$scopes.splice(index, 1)
})

export function claimed(scope){
	$scopes.includes(scope)
}

export function claim(scope){
	messenger.send('scopeclaim', {scope})
	$scopes.push(scope)
}

export function extension(uuid){
	const {src} = $files[`$${uuid}`]
	if(!src) return ''
	const filename = src.split('/').at(-1)
	return filename.match(/^\.*.*\.(\w+)$/)?.[1] ?? ''
}

export function add(){
	const uuid = crypto.randomUUID()
	$files[uuid] = {src: '', body: ''}
	return $files[`$${uuid}`]
}

try {
	const saved = sessionStorage.getItem('file-system')
	if(saved) live.set($files, JSON.parse(saved))
} catch {}

when($files).change().throttle(1000).then(() => {
	const files = live.get($files)
	sessionStorage.setItem('file-system', JSON.stringify(files))
})

