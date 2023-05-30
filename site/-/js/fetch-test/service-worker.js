import { ContextMessenger } from '/-/js/context-messenger/index.js'

const contextMessenger = ContextMessenger.get('*')
let tests = 0
let success = false

when(self).does('fetch').then(() => success = true)

when(contextMessenger).fetchteststarts().then(async startEvent => {
	tests++
	success = false
	startEvent.detail.respond()
	const endEvent = await when(contextMessenger).fetchtestends().once()
	if(tests > 5) return endEvent.detail.respond('failed')
	if(!success) return endEvent.detail.respond('inconclusive')
	tests = 0
	endEvent.detail.respond('success')
})

when(contextMessenger).fetchtestresets().then(event => {
	tests = 0
	success = false
	event.detail.respond()
})
