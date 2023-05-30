import { ensureFetch } from '/-/js/fetch-test/index.js'
import { requestServiceWorker } from '/-/js/service-worker/index.js'

await ensureFetch()

export const fileSystem = new class FileSystem extends EventTarget {
	#entries = new Map

	async sync(){
		const entries = await requestServiceWorker('filelist')
		this.#entries.clear()
		for(const [uuid, entry] of entries) this.#entries.set(uuid, entry)
		this.dispatchEvent(new CustomEvent('filesync'))
		this.dispatchEvent(new CustomEvent('filechange'))
		return [...this.#entries.keys()]
	}

	async #do(action, detail){
		await requestServiceWorker('fileupdate', detail)
		this.dispatchEvent(new CustomEvent(action, {detail}))
		this.dispatchEvent(new CustomEvent('filechange', {detail}))
	}

	async get(uuid){
		return {...this.#entries.get(uuid)}
	}

	findUuid(callback){
		for(const [uuid, entry] of this.#entries)
			if(callback(entry, uuid)) return uuid
		return null
	}

	async create(src = '', file = ''){
		const uuid = crypto.randomUUID()
		const entry = {src, file}
		this.#entries.set(uuid, entry)
		await this.#do('filecreate', {uuid, entry})
		return uuid
	}

	async update(uuid, file){
		const entry = this.#entries.get(uuid)
		if(!entry) return false
		entry.file = file
		await this.#do('fileupdate', {uuid, entry})
		return true
	}

	async move(uuid, src){
		const entry = this.#entries.get(uuid)
		if(!entry) return false
		entry.src = src
		await this.#do('filemove', {uuid, entry})
		return true
	}

	async delete(uuid){
		if(uuid == 'index') return false
		this.#entries.delete(uuid)
		const entry = null
		await this.#do('filedelete', {uuid, entry})
		return true
	}

}

await fileSystem.sync()
