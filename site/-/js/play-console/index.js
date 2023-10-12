let messenger
let playManager
const loading = Promise.all([
	import('/-/js/context-messenger/index.js').then(({ContextMessenger}) => {
		messenger = new ContextMessenger(window.parent)
	}),
	import('/-/js/play-manager/index.js')
		.then(module => playManager = module)
])

window.onerror = (event, source, line, column, error) => {
	sendError(source, line, column, error)
	return true
}

async function sendError(source, line, column, error){
	await loading
	const {message} = error
	const {pathname} = new URL(source, location.origin)
	const [uuid] = playManager.filelist()
		.find(([uuid, src]) => src == pathname)
	await messenger.send('error', {uuid, line, column, message})
}

window.ping = () => void loading.then(() => messenger.send('ping'))
window.pong = () => void loading.then(() => messenger.send('pong'))
