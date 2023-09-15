import * as webServer from '/-/js/web-server/index.js'
import * as storageLink from '/-/js/storage-link/index.js'

const {live, when, effect} = self.yozo

window.$site.play = {}
export const $play = window.$site.$play

const defaultUuid = 'dfe3f2e0-705e-4a53-bbfd-43073e5642f7'
const defaultCreation = {
	layout: 'side-by-side',
	spaces: ['', '', '', ''],
	files: {},
	name: 'Untitled',
	slug: ''
}

storageLink.local($play.$storage, 'play-manager:storage',
	{type: 'json', fallback: {[defaultUuid]: defaultCreation}})
storageLink.local($play.$order, 'play-manager:order',
	{type: 'array', fallback: Object.keys($play.storage)})
storageLink.session($play.$creations, 'play-manager:creations',
	{type: 'json', fallback: $play.storage})

live.link($play.$slug, {
	get: () => window.location.hash.slice(1),
	set: value => window.location.assign(`#${value}`),
	changes: when(window).hashchanges()
})
live.link($play.$uuid, () => {
	for(const [uuid, {slug}] of Object.entries($play.$creations))
		if($play.slug == slug) return uuid
	return null
})
live.link($play.$exists, () => $play.uuid != null)


when($play.$current.$files).change().throttle(500).then(() => {
	webServer.clear('/file/')
	const {files} = $play.$current
	if(!files) return
	webServer.upload(...Object.values(files))
})

live.link($play.$current, () => $play.$creations[$play.uuid] ?? null)

when($play.$current).deepchanges()
	.throttle(500)
	.then(() => $play.creations = {...$play.creations})

export function create({src = '/file/', body = ''}){
	const uuid = crypto.randomUUID()
	$play.$current.$files[uuid] = {src, body}
}
