let messenger
const loading = import('/-/js/context-messenger/index.js')
	.then(({ContextMessenger}) => messenger = new ContextMessenger(window.parent))

window.onerror = (event, source, line, column, error) => {
	sendError(source, line, column, error)
	return true
}

console.log = Object.assign((...args) => {
	console.log.original.apply(console, args)
	loading.then(async () => {
		await messenger.ready()
		messenger.send('log', {message: args.join(' ')})
	})
}, {original: console.log})

async function sendError(source, line, column, error){
	await loading
	await messenger.ready()
	const {message} = error
	const url = new URL(source, location.origin)
	const src = url.pathname
	await messenger.send('error', {src, line, column, message})
}

window.ping = () => void loading.then(() => messenger.send('ping'))
window.pong = () => void loading.then(() => messenger.send('pong'))
