import { requestServiceWorker } from '/-/js/service-worker/index.js'

export async function ensureFetch(){
	const {origin} = location
	await requestServiceWorker('fetchteststart')
	await fetch(`${origin}/sandbox/index.html`)
	const status = await requestServiceWorker('fetchtestend')
	if(status == 'inconclusive') return location.reload()
	if(status == 'failed')
		throw Error('Service worker failed to intercept fetch')
}

export async function resetFetchTest(){
	await requestServiceWorker('fetchtestreset')
}
