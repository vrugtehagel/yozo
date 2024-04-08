import { gray } from 'std/fmt/colors.ts'
import { build } from './build.js'
import '../archive/lib-0.0.1.js'

const {Flow} = self.yozo
const watcher = Deno.watchFs(['src'])
const flow = new Flow(async trigger => {
	for await(const change of watcher) trigger(change)
}).cleanup(() => {
	watcher.close()
	console.log('')
	console.log(`${gray('?')} Stopped watching.`)
	Deno.exit(1)
}).debounce(100).throttle(1000).then(async () => {
	await build({ noVerify: true }).catch(() => null)
	const now = new Date()
	console.log(`${gray('?')} Last updated ${now.toLocaleTimeString()}.`)
	console.log('')
}).debounce(3_600_000).once().now()

Deno.addSignalListener('SIGINT', () => flow.stop())
