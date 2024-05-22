import { red, green, gray } from 'std/fmt/colors.ts'
import { crypto } from 'std/crypto/mod.ts'
import { encodeBase64 } from 'std/encoding/base64.ts'
import { build } from './build.js'


// This script needs to be called from the CLI.
// It asks the user a few questions, and then builds & archives a new version.
if(!import.meta.main)
	throw Error('The archive script should be run as "deno task archive"')

// Must match with what the build script does
const lib = 'latest/lib.js'
const dev = 'latest/dev.js'

const printOk = message => console.log(`${green('✓')} ${message}`)
const printInfo = message => console.log(`${gray('?')} ${message}`)
const printFail = message => console.log(`${red('✘')} ${message}`)

await build({noVerify: true})
const json = await Deno.readTextFile('versions.json')
const versions = JSON.parse(json)

const version = {
	number: null,
	hash: null,
	timestamp: Date.now(),
	size: {gzip: -1, brotli: -1},
	changelog: {breaking: [], improvements: [], bugs: []}
}

printInfo('Let\'s go over the changes.\n')
printInfo('Leave empty to move on.')

await (async () => {
	const {breaking, improvements, bugs} = version.changelog
	let change
	while(change = prompt('  Breaking change:')) breaking.push(change)
	while(change = prompt('  Improvement:')) improvements.push(change)
	while(change = prompt('  Bug fixed:')) bugs.push(change)
})()

await (async () => {
	const args = ['--stdout', lib]
	const gzip = await new Deno.Command('gzip', {args}).output()
		.then(({stdout}) => stdout.length)
	const brotli = await new Deno.Command('brotli', {args}).output()
		.then(({stdout}) => stdout.length)
	Object.assign(version.size, {gzip, brotli})
	const print = gzip < 5000 ? printOk : printFail
	print(`Gzipped: ${gray(gzip.toString())} bytes`)
	printOk(`Brotli'd: ${gray(brotli.toString())} bytes`)
})()

await (async () => {
	const bytes = await Deno.readFile(lib)
	const hash = encodeBase64(await crypto.subtle.digest('MD5', bytes))
	version.hash = hash
	const isUnique = !versions.some(version => version.hash == hash)
	if(isUnique) printOk(`Hash: ${gray(hash)}`)
	else printFail(`Hash (not unique): ${gray(hash)}`)
})()

await (async () => {
	const [main, major, minor] = versions[0].number.split('.')
		.map(number => Number(number))
	const guess = version.changelog.breaking.length > 0
		? [main, major + 1, 0].join('.')
		: [main, major, minor + 1].join('.')
	printInfo(`Guessing version ${gray(guess)}`)
	const correct = confirm('  Continue?')
	if(correct) return version.number = guess
	let number
	while(true){
		number = prompt('  Enter version number:')
		const exists = versions.some(version => version.number == number)
		if(number && !exists) break
		printFail(`Version "${versionNumber}" already exists.`)
	}
	version.number = number
})()

await (async () => {
	const sure = confirm('  Are you sure you want to archive a new version?')
	if(!sure) return printFail('Operation cancelled. Exiting…')
	await Deno.copyFile(lib, `archive/lib-${version.number}.js`)
	await Deno.copyFile(dev, `archive/dev-${version.number}.js`)
	versions.unshift(version)
	const stringified = JSON.stringify(versions, null, 4)
	await Deno.writeTextFile('versions.json', stringified)
	printOk(`Version ${version.number} archived successfully.`)
})()
