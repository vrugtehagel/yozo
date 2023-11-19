import { walk } from 'std/fs/mod.ts'

import { register } from 'site/-/js/test-kit/index.js'
import 'src/index.js'


// This is the entry file for Deno to test stuff, run it with
//	deno test --allow-read=site
// We test using a custom test framework, so that we can run stuff in the
// browser as well. See site/-/js/test-kit/ for more info.
// This file just finds all .tks (test kit script) files and asks the test kit
// to run them. A test will fail if it throws, so Deno never actually needs to
// assert anything.

const exts = ['tks']
const skip = [/\/-\//]
for await(const entry of walk('site', {exts, skip})){
	Deno.test(entry.path, async nest => {
		const {tests, cleanup} = await register(entry.path)
		if(!tests?.length) console.warn(`No tests found for ${entry.path}`)
		for(const test of tests){
			await nest.step(`[run]    ${test.name}`, () => test.run())
			await nest.step(`[verify] ${test.name}`, () => test.verify())
		}
		cleanup()
	})
}
