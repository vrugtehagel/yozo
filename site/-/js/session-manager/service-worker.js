(() => {
	const {when} = self.yozo
	const {contextMessenger} = self

	self.SessionManager = class SessionManager {
		static #activeSession = null
		static #managers = new Map

		static *[Symbol.iterator](){ yield* this.#managers.values() }

		static for(sessionId){
			if(this.#managers.has(sessionId)) return this.#managers.get(sessionId)
			const manager = new SessionManager(sessionId)
			this.#managers.set(sessionId, manager)
			return manager
		}

		static async #cleanup(){
			const clients = await self.clients.matchAll()
			const ids = clients.map(client => client.id)
			for(const clientId of this.#managers.keys())
				if(!ids.includes(clientId)) SessionManager.for(sessionId).close()
		}

		static activate(sessionId){
			this.#activeSession = sessionId
		}

		static get active(){
			if(!this.#activeSession) return
			return SessionManager.for(this.#activeSession)
		}

		#sessionId = null
		#clientId = null
		#storage = new Map

		get sessionId(){ return this.#sessionId }
		get clientId(){ return this.#clientId }
		get storage(){ return this.#storage }

		constructor(){
			when(contextMessenger).does('notifysession').then(event => {
				const {clientId, payload} = event.detail
				const {sessionId} = payload
				const manager = SessionManager.for(sessionId)
				if(SessionManager.#managers.size > 10) SessionManager.#cleanup()
				manager.#clientId = clientId
				event.detail.respond()
			})
		}

		close(){
			this.storage.clear()
			SessionManager.#managers.delete(this.#sessionId)
			if(SessionManager.#activeSession == this.#sessionId)
				SessionManager.#activeSession = null
		}

	}
})()
