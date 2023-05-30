import { ContextMessenger } from '/-/js/context-messenger/index.js'
import { SessionManager } from '/-/js/session-manager/service-worker.js'

export const fileSystem = new class FileSystem {
	scopes = ['/file/', '/exam/']

	get storage(){ return SessionManager.active?.storage }

	getEntryBySrc(src){
		if(!this.storage) return
		return [...this.storage.values()].find(entry => entry.src == src)
	}

	getContentType(src){
		if(src.endsWith('.html')) return 'text/html'
		if(src.endsWith('.css')) return 'text/css'
		if(src.endsWith('.js') || src.endsWith('.mjs'))
			return 'text/javascript'
		if(src.endsWith('.json')) return 'application/json'
		return 'text/plain'
	}

	update({uuid, entry}){
		if(entry) this.storage?.set(uuid, entry)
		else this.storage?.delete(uuid)
	}

	list(){
		return this.storage ? [...this.storage] : []
	}

}

when(self).does('fetch').then(event => {
	const url = new URL(event.request.url)
	if(url.host != self.location.host) return
	if(!fileSystem.scopes.some(scope => url.pathname.startsWith(scope))) return
	const {pathname} = url
	const src = pathname.endsWith('/') ? pathname + 'index.html' : pathname
	const entry = fileSystem.getEntryBySrc(src)
	if(!entry) return event.respondWith(new Response('', {status: 404}))
	const status = 200
	const {file} = entry
	const contentType = fileSystem.getContentType(src)
	const headers = {'Content-Type': contentType}
	event.respondWith(new Response(file, {status, headers}))
})

const contextMessenger = ContextMessenger.get('*')
when(contextMessenger).fileupdates().then(event => {
	const {payload} = event.detail
	const {uuid, entry, sessionId} = payload
	SessionManager.activate(sessionId)
	fileSystem.update({uuid, entry})
	event.detail.respond()
})

when(contextMessenger).filelists().then(event => {
	const {sessionId} = event.detail.payload
	SessionManager.activate(sessionId)
	const entries = fileSystem.list()
	event.detail.respond(entries)
})
