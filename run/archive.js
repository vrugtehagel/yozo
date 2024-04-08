import { red, green, gray } from 'std/fmt/colors.ts'
import { crypto } from 'std/crypto/mod.ts'
import { encodeBase64 } from 'std/encoding/base64.ts'
import { build } from './build.js'

if(!import.meta.main)
	throw Error('The archive script should be run as "deno task archive"')

const print = message => console.log(`${gray('?')} ${message}`)
print.ok = message => console.log(`${green('✓')} ${message}`)
print.fail = message => console.log(`${red('✘')} ${message}`)

const lib = 'dist/lib-latest.js'
const dev = 'dist/dev-latest.js'

await build({noVerify: true})
const json = await Deno.readTextFile('versions.json')
const versions = JSON.parse(json)
const changelog = {}
const timestamp = Date.now()
const version = {
	number: null,
	hash: null,
	timestamp,
	size: {},
	changelog
}

print('Let\'s go over the changes.\n')
print('Leave empty to move on.')

let change
changelog.breaking = []
while(change = prompt('  Breaking change:')) changelog.breaking.push(change)
changelog.improvements = []
while(change = prompt('  Improvement:')) changelog.improvements.push(change)
changelog.bugs = []
while(change = prompt('  Bug fixed:')) changelog.bugs.push(change)

const args = ['--stdout', lib]
const gzip = await new Deno.Command('gzip', {args}).output()
	.then(({stdout}) => stdout.length)
const brotli = await new Deno.Command('brotli', {args}).output()
	.then(({stdout}) => stdout.length)
version.size = {gzip, brotli}
const sizeStatus = gzip < 5000 ? 'ok' : 'fail'
print[sizeStatus](`Gzipped: ${gray(gzip.toString())} bytes`)
print.ok(`Brotli'd: ${gray(brotli.toString())} bytes`)

const bytes = await Deno.readFile(lib)
const hash = encodeBase64(await crypto.subtle.digest('MD5', bytes))
version.hash = hash
const hashUnique = !versions.some(version => version.hash == hash)
if(hashUnique) print.ok(`Hash: ${gray(hash)}`)
else print.fail(`Hash (not unique): ${gray(hash)}`)

const [main, major, minor] = versions[0].number.split('.')
	.map(number => Number(number))
let versionNumber = changelog.breaking.length > 0
	? [main, major + 1, 0].join('.')
	: [main, major, minor + 1].join('.')
print(`Guessing version ${gray(versionNumber)}`)
const guessedCorrect = confirm('  Continue?')
if(!guessedCorrect) while(true){
	versionNumber = prompt('  Enter version number:')
	const exists = versions.some(version => version.number == versionNumber)
	if(!exists) break
	print.fail(`Version "${versionNumber}" already exists.`)
}
version.number = versionNumber

const sure = confirm('  Are you sure you want to archive this new version?')
if(!sure){
	print.fail('Operation cancelled. Exiting…')
	Deno.exit(0)
}

await Deno.copyFile(lib, `archive/lib-${version.number}.js`)
await Deno.copyFile(dev, `archive/dev-${version.number}.js`)

versions.unshift(version)
const stringified = JSON.stringify(versions, null, 4)
await Deno.writeTextFile('versions.json', stringified)

print.ok(`Version ${version.number} archived successfully.`)
