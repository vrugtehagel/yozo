import * as webServer from '/-/js/web-server/index.js'
import { htmlInclude } from '/-/js/html-include/index.js'

import { creations as defaultCreations } from './default-creations.js'

self.yozo.register('/-/yz/ui/ui-toast.yz')
const {live, when, effect} = self.yozo

export const $play = live({})
if(!location.pathname.startsWith('/file/')) webServer.claim('/file/')

$play.storage = JSON.parse(localStorage.getItem('play-manager:storage'))
when($play.$storage).deepchanges().then(() => {
	const json = JSON.stringify($play.storage)
	localStorage.setItem('play-manager:storage', json)
})
$play.storage ??= defaultCreations

$play.creations = JSON.parse(sessionStorage.getItem('play-manager:creations'))
when($play.$creations).deepchanges().throttle(500).then(() => {
	const json = JSON.stringify($play.creations)
	sessionStorage.setItem('play-manager:creations', json)
})
$play.creations ??= $play.storage

live.link($play.$connected, () => webServer.claimed('/file/'))
live.link($play.$mode, () => {
	if(!$play.connected) return 'disconnected'
	if(!$play.$creations[$play.uuid]) return 'picking'
	return 'editing'
})
live.link($play.$uuid, {
	get: () => sessionStorage.getItem('play-manager:current-uuid'),
	set: value => sessionStorage.setItem('play-manager:current-uuid', value),
	changes: when(window).storages()
		.if(({key}) => key == 'play-manager:current-uuid')
})

if(window.playManagerRequest){
	const uuid = crypto.randomUUID()
	$play.$creations[uuid] = window.playManagerRequest
	delete window.playManagerRequest
	open(uuid)
} else {
	open($play.uuid)
}

effect(() => {
	when(current().$files).deepchange().then(() => $play.saved = false)
	when(current().$files).deepchange().throttle(500).then(() => {
		webServer.clear('/file/')
		const files = {...current().files}
		webServer.upload(...Object.values(files).map(({src, body}) => {
			if(webServer.extension(src) != 'html') return {src, body}
			const modified = htmlInclude(body, `
				<script src="/-/js/play-console/index.js"></script>
			`)
			return {src, body: modified}
		}))
	}).now()
})

when(window).beforeunloads().then(event => {
	if($play.saved) return
	event.preventDefault()
	event.returnValue = true
})


export async function reset(){
	if(reset.inProgress) return
	reset.inProgress = true
	await customElements.whenDefined('ui-toast')
	const {storage, creations} = $play
	const uiToast = document.createElement('ui-toast')
	uiToast.type = 'info'
	uiToast.actionText = 'Undo'
	uiToast.textContent = `Presets reset to default.`
	const showPromise = uiToast.show()
	when(uiToast).does('action').then(() => {
		Object.assign($play, {storage, creations})
	}).until(showPromise)
	$play.storage = defaultCreations
	$play.creations = defaultCreations
	await showPromise
	reset.inProgress = false
}

export function current(){
	return $play.$creations[`$${$play.uuid}`]
}

export function reconnect(){
	webServer.claim('/file/')
}

export function list(){
	return Object.entries($play.$creations)
		.map(([key, $creation]) => [key.slice(1), $creation.name])
		.sort(([uuidA, nameA], [uuidB, nameB]) => nameA.localeCompare(nameB))
}

export function create(){
	const uuid = crypto.randomUUID()
	const fileUuid = crypto.randomUUID()
	const name = 'Untitled'
	const file = {src: '/file/index.html', body: ''}
	const files = {[fileUuid]: file}
	const spaces = [`file:${fileUuid}`, '', '', '']
	const layout = 'side-by-side'
	$play.$creations[uuid] = {name, files, spaces, layout}
	$play.saved = false
	$play.uuid = uuid
}

export function open(uuid){
	$play.uuid = uuid
	const stored = JSON.stringify($play.$storage[`$${uuid}`].files)
	const session = JSON.stringify(current().files)
	$play.saved = stored == session
}

export function close(){
	$play.uuid = null
}

export function rename(name){
	current().name = name
	if(!$play.$storage[$play.uuid]) return
	$play.$storage[`$${$play.uuid}`].name = name
}

export function save(){
	$play.saved = true
	$play.$storage[$play.uuid] = {...live.get(current())}
}

export function duplicate(){
	let name = current().name
	const match = name.match(/ \(((yet )?another )?copy( \d+)?\)/)
	const amount = Number(match?.[3])
		|| match?.filter(part => part != null).length
	if(amount) name = name.slice(0, -1 * match[0].length)
	const postfix = amount >= 3
		? `copy ${amount + 1}`
		: ['copy', 'another copy', 'yet another copy'][amount || 0]
	name = `${name} (${postfix})`
	const original = {...live.get(current()), name}
	create()
	Object.assign(current(), original)
	close()
}

export async function remove(){
	await customElements.whenDefined('ui-toast')
	const uuid = $play.uuid
	const creation = $play.$creations[uuid]
	const stored = $play.$storage[uuid]
	const uiToast = document.createElement('ui-toast')
	uiToast.type = 'info'
	uiToast.actionText = 'Undo'
	uiToast.textContent = 'Preset deleted.'
	const showPromise = uiToast.show()
	when(uiToast).does('action').then(() => {
		$play.$creations[uuid] = creation
		$play.$storage[uuid] = stored
	}).until(showPromise)
	delete $play.$creations[uuid]
	delete $play.$storage[uuid]
	$play.uuid = null
}

export function filelist(){
	return Object.entries(current().$files)
		.map(([key, $file]) => [key.slice(1), $file.src])
		.sort(([uuidA, nameA], [uuidB, nameB]) => nameA.localeCompare(nameB))
}

export function file(uuid){
	return current().$files[`$${uuid}`]
}

export function createFile({src, body = ''}){
	if(src.endsWith('/')) src += 'index.html'
	const uuid = crypto.randomUUID()
	current().$files[uuid] = {src, body}
	return uuid
}

export async function removeFile(uuid){
	await customElements.whenDefined('ui-toast')
	const file = {...current().$files[uuid]}
	const uiToast = document.createElement('ui-toast')
	uiToast.type = 'info'
	uiToast.actionText = 'Undo'
	uiToast.textContent = `File ${file.src.split('/').at(-1)} deleted.`
	const showPromise = uiToast.show()
	when(uiToast).does('action').then(() => {
		current().$files[uuid] = file
	}).until(showPromise)
	delete current().$files[uuid]
	await showPromise
}

export function visibleSpaces(){
	const {layout} = current()
	if(layout == 'single') return 1
	if(layout == 'side-by-side') return 2
	if(layout == 'stack') return 2
	if(layout == 'triple-split') return 3
	if(layout == 'quartiles') return 4
	return 0
}

export function reveal(src){
	const match = filelist()
		.find(([uuid, pathname]) => pathname == src)
	if(!match){
		const uiToast = document.createElement('ui-toast')
		uiToast.type = 'info'
		uiToast.textContent = 'File does not exist.'
		uiToast.show()
		return
	}
	const [uuid] = match
	const index = current().spaces.indexOf(`file:${uuid}`)
	if(index < 0 || index >= visibleSpaces()) return
	current().$spaces[0] = `file:${uuid}`
}

