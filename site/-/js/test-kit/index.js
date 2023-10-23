import { Snippet } from './snippet.js'
import { Test } from './test.js'


const parser = new RegExp([
	'^// test: .*$\n(^// .*$\n)+',
	'^// (?!test: ).*$\n(^(?!//).*$\n)+'
].join('|'), 'mig')

async function readFile(src){
	const url = new URL(src)
	if(url.protocol == 'file:') return await Deno.readTextFile(url)
	const response = await fetch(url)
	if(!response.ok) throw Error(`Could not fetch ${url}`)
	return await response.text()
}

export async function register(...urls){
	const registrations = await Promise.allSettled(urls.map(async url => {
		const source = await readFile(url)
		const tests = (source.match(parser) ?? []).map(part => {
			const test = Test.from(part)
			if(test) return test
			Snippet.from(part)
		}).filter(test => test != null)
		return tests
	}))
	const rejected = registrations.find(({status}) => status == 'rejected')
	if(rejected) console.error(rejected.reason)
	const tests = registrations
		.flatMap(registration => registration.value ?? [])
	tests.forEach(test => test.compile())
	return tests
}
