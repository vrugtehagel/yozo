import * as webServer from '/-/js/web-server/index.js'

import { creations as defaultCreations } from './default-creations.js'

self.yozo.register('/-/yz/ui/ui-toast.yz')
const {live, when, effect, track} = self.yozo

export const $play = live({})
if(!location.pathname.startsWith('/file/')) webServer.claim('/file/')

$play.storage = JSON.parse(localStorage.getItem('play-manager:storage'))
	?? defaultCreations
when($play.$storage).deepchanges().then(() => {
	const json = JSON.stringify($play.storage)
	localStorage.setItem('play-manager:storage', json)
})

$play.creations = JSON.parse(sessionStorage.getItem('play-manager:creations'))
	?? $play.storage
when($play.$creations).deepchanges().throttle(500).then(() => {
	const json = JSON.stringify($play.creations)
	sessionStorage.setItem('play-manager:creations', json)
})

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
open($play.uuid)

effect(() => {
	when(current().$files).deepchange().then(() => {
		$play.saved = false
	}).throttle(500).then(() => {
		webServer.clear('/file/')
		const files = {...current().files}
		webServer.upload(...Object.values(files).map(({src, body}) => {
			if(webServer.extension(src) != 'html') return {src, body}
			const parser = new DOMParser
			const doc = parser.parseFromString(body, 'text/html')
			doc.head.insertAdjacentHTML('afterbegin', `
				<script src="/-/js/play-console/index.js"></script>
			`)
			const serializer = new XMLSerializer
			const string = serializer.serializeToString(doc)
			return {src, body: string}
		}))
	}).now()
})

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
	const creation = Object.values(defaultCreations)
		.find(creation => creation.name == 'Boilerplate')
	$play.$creations[uuid] = {...creation, name: 'Untitled'}
	$play.uuid = uuid
}

export function open(uuid){
	$play.uuid = uuid
	const stored = JSON.stringify($play.$storage[`$${uuid}`].files)
	const session = JSON.stringify($play.$creations[`$${uuid}`].files)
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
	$play.$storage[$play.uuid] = $play.$creations[$play.uuid]
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
	uiToast.type = 'danger'
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
}

export async function removeFile(uuid){
	await customElements.whenDefined('ui-toast')
	const file = {...current().$files[uuid]}
	const uiToast = document.createElement('ui-toast')
	uiToast.type = 'danger'
	uiToast.actionText = 'Undo'
	uiToast.textContent = `File ${file.src.split('/').at(-1)} deleted.`
	const showPromise = uiToast.show()
	when(uiToast).does('action').then(() => {
		current().$files[uuid] = file
	}).until(showPromise)
	delete current().$files[uuid]
	await showPromise
}



