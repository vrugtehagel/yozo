import { green, yellow, red, gray } from 'std/fmt/colors.ts'
import { writeAll } from 'std/streams/mod.ts'
import { serveDir } from 'std/http/file_server.ts'

import { build } from './build.js'
import '../archive/lib-1.0.0.js'


const {Flow} = self.yozo

const port = 8787
const hostname = 'localhost'
const serverController = new AbortController
const {signal} = serverController
const onListen = () => console.log(`${gray('?')} Serving at ${hostname}:${port}.`)
Deno.serve({port, hostname, signal, onListen}, request => {
	return serveDir(request, {fsRoot: 'dist/', quiet: true, headers: []})
})

// If changing below, check /docs/flow/constructor/
const watcher = Deno.watchFs(['site', 'src'])
const flow = new Flow(async trigger => {
	for await(const change of watcher) trigger(change)
}).cleanup(() => {
	serverController.abort()
	watcher.close()
	console.log('')
	console.log(`${gray('?')} Serving terminated.`)
	Deno.exit(1)
}).throttle(1000).then(async () => {
	console.clear()
	await build()
	const now = new Date()
	console.log(`${gray('?')} Last updated ${now.toLocaleTimeString()}.`)
	console.log('')
}).debounce(3_600_000).once().now()

Deno.addSignalListener('SIGINT', () => flow.stop())
