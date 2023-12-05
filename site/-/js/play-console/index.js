let messenger
const loading = import('/-/js/context-messenger/index.js')
	.then(({ContextMessenger}) => messenger = new ContextMessenger(window.parent))
	.then(() => messenger.ready())

window.onerror = (event, source, line, column, error) => {
	sendError(source, line, column, error)
	return true
}

window.addEventListener('unhandledrejection', async event => {
	event.preventDefault()
	await loading
	const {message} = event.reason
	await messenger.send('error', {message})
})

async function sendError(source, line, column, error){
	await loading
	const {message} = error
	const url = new URL(source, location.origin)
	const src = url.pathname
	await messenger.send('error', {src, line, column, message})
}

console.log = Object.assign((...args) => {
	console.log.original.apply(console, args)
	loading.then(async () => {
		const message = args.map(arg => prettyPrint(arg)).join(' ')
		messenger.send('log', {message})
	})
}, {original: console.log})

window.ping = () => void loading.then(() => messenger.send('ping'))
window.pong = () => void loading.then(() => messenger.send('pong'))

function prettyPrint(thing){
	if(typeof thing == 'number') return `${thing}`
	if(typeof thing == 'bigint') return `${thing}n`
	if(typeof thing == 'string') return `"${thing}"`
	if(typeof thing == 'undefined') return 'undefined'
	if(typeof thing == 'symbol') return thing.toString()
	if(typeof thing == 'boolean') return `${thing}`
	if(typeof thing == 'function'){
		if(thing.toString().startsWith('class'))
			return `class ${thing.name} { … }`
		return `function ${thing.name}(){ … }`
	}
	if(thing == null) return 'null'
	if(thing instanceof Element) return `<${thing.localName}>`
	if(thing instanceof Node && thing.nodeName) return `${thing.nodeName}`
	if(Array.isArray(thing)){
		const preview = thing.slice(0, 3).map(prettyPrint).join(', ')
		return thing.length <= 3 ? `[ ${preview} ]` : `[ ${preview}, … ]`
	}
	if(thing.constructor.name != 'Object') `${thing.constructor.name} { … }`
	const keys = Reflect.ownKeys(thing)
	const preview = keys
		.slice(0, 2)
		.map(key => `${prettyPrint(key)}: ${prettyPrint(thing[key])}`)
		.join(', ')
	return keys.length <= 2 ? `{ ${preview} }` : `{ ${preview}, … }`
}
