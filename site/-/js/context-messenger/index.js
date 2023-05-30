export class ContextMessenger extends EventTarget {
	static #all = Symbol()
	static #messengers = new WeakMap
	static #constructing = false
	static get(sender, receiver = globalThis){
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

	// refrain from using when() since this might execute in a testing context
	async send(type, payload = null){
		const sender = this.#sender
		if(sender == ContextMessenger.#all) return
		const uuid = crypto.randomUUID()
		const origin = location
		let resolve
		const promise = new Promise(resolver => resolve = resolver) 
		const controller = new AbortController
		const {signal} = controller
		this.#receiver.addEventListener('message', event => {
			if(event.data.uuid != uuid) return
			controller.abort()
			resolve(event.data.payload)
		}, {signal})
		sender.postMessage({type, uuid, payload}, origin)
		return await promise
	}

	#respond(event){
		if(this.#sender != ContextMessenger.#all && this.#sender != event.source) return
		const {data} = event
		const {type, uuid, payload} = data
		const respond = payload =>
			event.source.postMessage({type: 'respond', uuid, payload})
		const originalEvent = event
		const detail = {payload, respond, originalEvent}
		this.dispatchEvent(new CustomEvent(type, {detail}))
	}
}
