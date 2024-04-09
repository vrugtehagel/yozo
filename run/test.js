import { walk } from 'std/fs/mod.ts'
import '../src/index.js'


// We import every file in tests/, except for those that start with "bo-"
// because those are browser-only tests (hence "bo").
// There are no Deno-only tests because Yozo is built for the browser and
// anything you could use Yozo for in Deno you could use in the browser.

// The tests themselves assume the existance of this global assert function.
self.assert = pass => {
	if(pass) return
	throw Error('Assertion failed')
}

const browserOnlyTests = /\/bo-/
const skip = [browserOnlyTests]
for await(const {path} of walk('tests', {exts: ['js'], skip})){
	Deno.test(path, async () => {
		await import(new URL(`../${path}`, import.meta.url))
	})
}
