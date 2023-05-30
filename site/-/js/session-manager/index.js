import { requestServiceWorker } from '/-/js/service-worker/index.js'

let sessionId = sessionStorage.getItem('sessionId')

if(!sessionId){
	sessionId = crypto.randomUUID()
	sessionStorage.setItem('sessionId', sessionId)
}

requestServiceWorker('notifysession', {sessionId})
