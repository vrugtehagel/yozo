(() => {
	const {when, timeout} = self.yozo
	const {ContextMessenger} = self

	const messenger = new ContextMessenger('web-server')
	const servable = ['/file/']
	const contentTypes = {
		html: 'text/html',
		css: 'text/css',
		js: 'text/javascript',
		mjs: 'text/javascript',
		json: 'application/json',
		txt: 'text/plain',
	}

	async function request(src){
		const body = await messenger.send('filerequest', {src})
		if(body == null) return new Response('Not Found', {status: 404})
		const extension = src.includes('.') ? src.split('.').at(-1) : ''
		const contentType = contentTypes[extension] ?? contentTypes.txt
		const headers = {'Content-Type': contentType}
		return new Response(body, {status: 200, headers})
	}

	async function gatewayTimeout(){
		await timeout(5000)
		return new Response('Gateway Timeout', {status: 504})
	}

	when(self).does('fetch').then(event => {
		const url = new URL(event.request.url)
		if(url.host != self.location.host) return
		const {pathname} = url
		if(!servable.some(scope => pathname.startsWith(scope))) return
		const src = pathname.endsWith('/') ? `${pathname}index.html` : pathname
		const response = Promise.any([request(src), gatewayTimeout()])
		event.respondWith(response)
	})

})()
