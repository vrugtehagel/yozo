const {when} = self.yozo

export class ContextMessenger extends EventTarget {
	static #all = Symbol()
	static #messengers = new WeakMap
	static #constructing = false
	static get(sender, receiver = self){
		if(sender == '*') sender = this.#all
		if(this.#messengers.has(sender)) return this.#messengers.get(sender)
		this.#constructing = true
		const messenger = new ContextMessenger(sender, receiver)
		this.#constructing = false
		ContextMessenger.#messengers.set(sender, messenger)
		return messenger
	}

	#receiver
	#sender

	constructor(sender, receiver){
		super()
		if(!ContextMessenger.#constructing) throw Error('Illegal constructor')
		this.#receiver = receiver
		this.#sender = sender
		when(this.#receiver).messages().then(event => this.#respond(event))
	}

	async send(type, payload = null){
		const sender = this.#sender
		if(sender == ContextMessenger.#all) return
		const uuid = crypto.randomUUID()
		const origin = location
		const event = await when(this.#receiver).messages()
			.if(event => event.data.uuid == uuid)
			.once()
			.after(() => sender.postMessage({type, uuid, payload}, origin))
		return event.data.payload
	}

	#respond(event){
		if(this.#sender != ContextMessenger.#all && this.#sender != event.source) return
		const {type, uuid, payload} = event.data
		const respond = payload =>
			event.source.postMessage({type: 'respond', uuid, payload})
		const originalEvent = event
		const detail = {payload, respond, originalEvent}
		this.dispatchEvent(new CustomEvent(type, {detail}))
	}
}
