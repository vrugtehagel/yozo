(() => {
	const {when} = self.yozo
	const {contextMessenger, SessionManager} = self

	self.fileSystem = new class FileSystem {
		scopes = ['/file/', '/exam/', '/test/']

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

		update(uuid, entry){
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

	when(contextMessenger).does('filepush').then(event => {
		const {sessionId, data} = event.detail.payload
		SessionManager.activate(sessionId)
		const uuids = data.map(([uuid]) => uuid)
		for(const [uuid] of fileSystem.storage)
			if(!uuids.includes(uuid)) fileSystem.update(uuid)
		for(const [uuid, entry] of data) fileSystem.update(uuid, entry)
		event.detail.respond()
	})

	when(contextMessenger).does('filepull').then(event => {
		const {sessionId} = event.detail.payload
		SessionManager.activate(sessionId)
		const entries = fileSystem.list()
		event.detail.respond(entries)
	})
})()
