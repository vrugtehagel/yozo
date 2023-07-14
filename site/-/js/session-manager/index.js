import { requestServiceWorker } from '/-/js/service-worker/index.js'

export const sessionId = sessionStorage.getItem('sessionId')
	?? crypto.randomUUID()

sessionStorage.setItem('sessionId', sessionId)

requestServiceWorker('notifysession', {sessionId})
