(() => {
	const {when, timeout} = self.yozo
	const {ContextMessenger} = self

	// only urls under these scopes may be claimed
	const scopes = ['/file/']

	const contentTypes = {
		html: 'text/html',
		css: 'text/css',
		js: 'text/javascript',
		mjs: 'text/javascrtip',
		json: 'application/json',
		txt: 'text/plain',
	}

	const messenger = new ContextMessenger('file-system')

	function getContentType(src){
		for(const [extension, contentType] of Object.entries(contentTypes))
			if(src.endsWith(`.${extension}`)) return contentType
		return contentTypes.txt
	}

	async function request(scope, src){
		const body = await messenger.send('filerequest', {scope, src})
		if(body == null) return new Response('Not Found', {status: 404})
		const contentType = getContentType(src)
		const headers = {'Content-Type': contentType}
		return new Response(body, {status: 200, headers})
	}

	async function gatewayTimeout(){
		await timeout(5000)
		return new Response('504 Gateway Timeout', {status: 504})
	}

	when(self).does('fetch').then(event => {
		const url = new URL(event.request.url)
		if(url.host != self.location.host) return
		const scope = scopes.find(scope => url.pathname.startsWith(scope))
		if(!scope) return
		const {pathname} = url
		const src = pathname.endsWith('/') ? pathname + 'index.html' : pathname
		event.respondWith(Promise.any([request(scope, src), gatewayTimeout()]))
	})

})()
