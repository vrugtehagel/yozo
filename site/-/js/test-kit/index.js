import { parse } from './parse.js'


export async function register(url){
	if(typeof Deno != 'undefined') return await denoRegister(url)
	return await browserRegister(url)
}

async function denoRegister(url){
	const source = await Deno.readTextFile(url)
	const tests = parse(source)
	const cleanup = () => {}
	return {tests, cleanup}
}

async function browserRegister(url){
	if(url instanceof URL) url = url.href
	const iframe = document.createElement('iframe')
	let onload
	const loading = new Promise(resolve => onload = resolve)
	iframe.addEventListener('load', onload)
	iframe.src = '/-/js/test-kit/sandbox.html'
	iframe.hidden = true
	iframe.style.setProperty('display', 'none')
	document.body.append(iframe)
	await loading
	const {ContextMessenger} = await import('/-/js/context-messenger/index.js')
	const messenger = new ContextMessenger(iframe.contentWindow)
	await messenger.ready()
	const shells = await messenger.send('register', {url})
	const requestTest = async (name, type) => {
		const message = await messenger.send('run', {name, type})
		if(message != null) throw Error(message);
	}
	const tests = shells.map(shell => {
		const {name, code} = shell
		const run = () => requestTest(name, 'test')
		const verify = () => requestTest(name, 'verify')
		return {name, code, run, verify}
	})
	const cleanup = () => {
		iframe.src = 'about:blank'
		iframe.remove()
	}
	return {cleanup, tests}
}
