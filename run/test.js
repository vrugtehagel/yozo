import { glob } from 'node:fs/promises'
import { test } from 'node:test'
import '../src/index.js'


// We import every file in test/, except for those that start with "bo-"
// because those are browser-only tests (hence "bo").
// There are no Node-only tests because Yozo is built for the browser and
// anything you could use Yozo for in Node you could use in the browser.

// The tests themselves assume the existance of this global assert function.
globalThis.assert = pass => {
	if(pass) return
	throw Error('Assertion failed')
}

for await(const path of glob('test/**/*.js', {exclude: ['**/bo-*']})){
	test(path, async () => import(import.meta.resolve('../' + path)))
}
