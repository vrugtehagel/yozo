import { walk } from 'std/fs/mod.ts'
import '../src/index.js'

// This file is not a task, it is intended for `deno test`
// We import every file in test/, except for those that start with bo- since
// those are browser-only tests.

// The tests themselves assume the existance of this global assert function.
self.assert = pass => {
	if(pass) return
	throw Error('Assertion failed')
}

const browserOnlyTests = /\/bo-/
const skip = [browserOnlyTests]
for await(const {path} of walk('test', {exts: ['js'], skip})){
	Deno.test(path, async () => {
		await import(new URL(`../${path}`, import.meta.url))
	})
}
