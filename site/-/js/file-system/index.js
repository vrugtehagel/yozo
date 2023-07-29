import { ensureFetch } from '/-/js/fetch-test/index.js'
import { requestServiceWorker } from '/-/js/service-worker/index.js'

await ensureFetch()

const {live} = self.yozo

export const $files = live({})

export async function pull(){
	const data = await requestServiceWorker('filepull')
	const files = {}
	for(const [uuid, entry] of data) files[uuid] = entry
	live.set($files, files)
}

export async function push(){
	const data = Object.entries($files)
	await requestServiceWorker('filepush', {data})
}

await pull()
