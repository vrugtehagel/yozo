import { ContextMessenger } from '/-/js/context-messenger/index.js'
import { parse } from '/-/js/test-kit/parse.js'
import '/lib-latest.js'

const {when, purify, until} = self.yozo


const messenger = new ContextMessenger(window.parent)

when(messenger).registers().then(purify(async event => {
	const {url} = event.detail.payload
	const response = await until(fetch(url))
	if(!response.ok) throw Error(`Could not fetch "${url}"`)
	const source = await until(response.text())
	const tests = parse(source)
	const shells = tests.map(({name, code}) => ({name, code}))
	when(messenger).runs().then(async event => {
		const {name, type} = event.detail.payload
		const test = tests.find(test => test.name == name)
		if(!test) return event.detail.respond(null)
		const method = type == 'test' ? 'run' : 'verify'
		const [result] = await Promise.allSettled([test[method]()])
		event.detail.respond(result.reason?.message ?? null)
	})
	event.detail.respond(shells)
}))

messenger.ready()
