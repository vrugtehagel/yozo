import { Snippet } from './snippet.js'
import { Test } from './single.js'


const parser = new RegExp([
	'^// test: .*$\n(^// .*$\n)+',
	'^// (?!test: ).*$\n(^(?!//).*$\n)+'
].join('|'), 'mig')

async function readFile(src){
	if(typeof Deno != 'undefined') return await Deno.readTextFile(src)
	const response = await fetch(src)
	if(!response.ok) throw Error(`Could not fetch ${src}`)
	return await response.text()
}

export function reset(){
	Snippet.reset()
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
