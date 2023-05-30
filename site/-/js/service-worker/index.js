import { ContextMessenger } from '/-/js/context-messenger/index.js'

let contextMessenger = null
const loading = navigator.serviceWorker.ready.then(registration => {
	const sender = registration.active
	const receiver = navigator.serviceWorker
	contextMessenger = ContextMessenger.get(sender, receiver)
})

export async function requestServiceWorker(type, payload = {}){
	if(!contextMessenger) await loading
	payload.sessionId = sessionStorage.getItem('sessionId')
	return await contextMessenger.send(type, payload)
}
