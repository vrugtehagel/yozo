(() => {
	const {when} = self.yozo

	// simplified version; sender == '*', receiver == self
	// When refactoring to module, delete this file and just use index.js

	self.contextMessenger = new class ContextMessenger extends EventTarget {
		constructor(){
			super()
			when(self).messages().then(event => this.#respond(event))
		}

		#respond(event){
			const {type, uuid, payload} = event.data
			const respond = payload =>
				event.source.postMessage({type: 'respond', uuid, payload})
			const originalEvent = event
			const detail = {payload, respond, originalEvent}
			this.dispatchEvent(new CustomEvent(type, {detail}))
		}
	}

})()

