let waitToRemoveBase
let done
let testing

export default async function evalModule(string, baseURL, testrun){
	if(!done){
		testing = new Promise(resolve => done = resolve)
		evalModule('', 'https://se.se/', true)
	}
	if(!testrun && testing) await testing
	const uuid = crypto.randomUUID()
	self[uuid] = result => {
		base.remove()
		script.remove()
		delete self[uuid]
		if(!testing) return
		testing = false
		waitToRemoveBase = result != 'https://se.se/'
		done()
	}
	const script = document.createElement('script')
	const base = document.createElement('base')
	script.type = 'module'
	script.textContent = `self[\`${uuid}\`](import.meta.url);${string}`
	base.href = baseURL
	document.head.prepend(base, script)
	if(!waitToRemoveBase) base.remove()
}
