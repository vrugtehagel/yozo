const {when} = self.yozo

await navigator.serviceWorker.register('/service-worker.js', {
	updateViaCache: 'none'
})

const registration = await navigator.serviceWorker.ready

if(!navigator.serviceWorker.controller){
	await when(navigator.serviceWorker).controllerchanges().once()
		.after(() => registration.active.postMessage({type: 'forceactivate'}))
}
