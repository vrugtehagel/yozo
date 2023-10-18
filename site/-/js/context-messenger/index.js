// Cannot use when() here because this script needs to be able to exist
// in "clean" contexts such as in the playground

export class ContextMessenger extends EventTarget {
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
		this.#receiver
			.addEventListener('message', event => this.#respond(event))
	}

	async send(type, payload = null){
		const sender = this.#sender
		const uuid = crypto.randomUUID()
		const origin = location
		const controller = new AbortController
		const {signal} = controller
		let done
		const promise = new Promise(resolve => done = resolve)
		this.#receiver.addEventListener('message', event => {
			if(event.data.uuid != uuid) return
			done(event.data.payload)
			controller.abort()
		}, {signal})
		sender.postMessage({type, uuid, payload}, origin)
		return promise
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
