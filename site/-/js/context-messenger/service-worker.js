// When refactoring to module, delete this file and just use index.js
(() => {
	const {when} = self.yozo

	self.ContextMessenger = class ContextMessenger extends EventTarget {
		#isBroadcastChannel
		#receiver
		#sender

		constructor(sender, receiver = self){
			super()
			this.#isBroadcastChannel = typeof sender == 'string'
			if(this.#isBroadcastChannel)
				sender = receiver = new BroadcastChannel(sender)
			this.#sender = sender
			this.#receiver = receiver
			when(this.#receiver).messages().then(event => this.#respond(event))
		}

		async send(type, payload = null){
			const sender = this.#sender
			const uuid = crypto.randomUUID()
			const origin = location
			const event = await when(this.#receiver).messages()
				.if(event => event.data.uuid == uuid)
				.once()
				.after(() => sender.postMessage({type, uuid, payload}, origin))
			return event.data.payload
		}

		#respond(event){
			const sender = this.#isBroadcastChannel ? this.#sender : event.source
			if(this.#sender != sender) return
			const {type, uuid, payload} = event.data
			if(type == 'respond') return
			const respond = payload =>
				sender.postMessage({type: 'respond', uuid, payload})
			const detail = {payload, respond}
			this.dispatchEvent(new CustomEvent(type, {detail}))
		}
	}

})()

