// This is the entry file for Deno to test stuff
// We test using a custom test framework, so that we can run stuff in the
// browser as well. See site/-/js/test-kit/ for more info.
// This file just finds all .tks (test kit script) files and asks the test kit
// to run them. A test will throw if it fails, so Deno never actually needs to
// assert anything.

import { expandGlob } from 'std/fs/mod.ts'
import { toFileUrl } from 'std/path/mod.ts'
import { register } from 'site/-/js/test-kit/index.js'
import 'src/index.js'

const directory = new URL(import.meta.url.split('/').slice(0, -1).join('/'))
for await(const {path} of expandGlob('./site/**/*.tks')){
	const url = toFileUrl(path)
	const name = path.startsWith(directory.pathname)
		? path.replace(directory.pathname, '')
		: path
	if(path.includes('/-/')) continue
	Deno.test(name, async nest => {
		const tests = await register(url)
		if(!tests?.length) console.warn(`No tests found for "${url}"`)
		for(const test of tests){
			await nest.step(`[run]    ${test.name}`, () => test.run())
			await nest.step(`[verify] ${test.name}`, () => test.verify())
		}
	})
}
