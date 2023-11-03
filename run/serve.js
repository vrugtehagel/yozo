import { green, yellow, red, gray } from 'std/fmt/colors.ts'
import { writeAll } from 'std/streams/mod.ts'
import { serveDir } from 'std/http/file_server.ts'

import { build } from './build.js'

const port = 8787
const hostname = 'localhost'
const serverController = new AbortController
const {signal} = serverController
const watcher = Deno.watchFs(['site', 'src'])
const onListen = () => console.log(`${gray('?')} Serving at localhost:${port}.`)
Deno.serve({port, hostname, signal, onListen}, request => {
	return serveDir(request, {fsRoot: 'dist/', quiet: true, headers: []})
})

Deno.addSignalListener('SIGINT', () => {
	if(stopped) return
	clearTimeout(timeoutId)
	clearTimeout(updater)
	serverController.abort()
	watcher.close()
	console.log('')
	console.log(`${gray('?')} Serving terminated.`)
	Deno.exit(1)
})

let stopped = false
let timeoutId
let queued = true
const updater = setInterval(async () => {
	if(!queued) return
	clearTimeout(timeoutId)
	setTimeout(() => {
		clearTimeout(updater)
		serverController.abort()
		watcher.close()
		console.log(`${gray('?')} Stopped serving due to inactivity.`)
		stopped = true
		Deno.exit(1)
	}, 3_600_000)
	console.clear()
	await build()
	const now = new Date
	const hour = now.getHours().toString()
	const minute = now.getMinutes().toString().padStart(2, '0')
	const second = now.getSeconds().toString().padStart(2, '0')
	console.log(`${gray('?')} Last updated ${hour}:${minute}:${second}.`)
	console.log('')
	queued = false
}, 1000)

for await(const change of watcher) queued = true
