import {readFile, writeFile, cp} from 'node:fs/promises'
import {stdin, stdout, exit} from 'node:process'
import {createInterface} from 'node:readline/promises'
import {exec} from 'node:child_process'
import {promisify} from 'node:util'
import {createHash} from 'node:crypto'
import {build} from './build.js'


// Colors!
const green = text => `\x1b[32m${text}\x1b[0m`
const red = text => `\x1b[31m${text}\x1b[0m`
const gray = text => `\x1b[90m${text}\x1b[0m`

// This script needs to be called from the CLI.
// It asks the user a few questions, and then builds & archives a new version.
if(!import.meta.main)
	throw Error('The archive script should be run as "npm run archive"')

// Must match with what the build script does
const lib = 'latest/lib.js'
const dev = 'latest/dev.js'

const printOk = message => console.log(`${green('✓')} ${message}`)
const printInfo = message => console.log(`${gray('?')} ${message}`)
const printFail = message => console.log(`${red('✘')} ${message}`)

const readline = createInterface({input: stdin, output: stdout})
const ask = message => readline.question(message + ' ').catch(() => exit())
const confirm = async message => {
	let answer
	do answer = (await ask(message + ' [y/N]')).toLowerCase()
	while(answer != 'y' && answer != 'n')
	return answer == 'y'
}

await build()
const json = await readFile('versions.json', 'utf8')
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
	while(change = await ask('  Breaking change:')) breaking.push(change)
	while(change = await ask('  Improvement:')) improvements.push(change)
	while(change = await ask('  Bug fixed:')) bugs.push(change)
})()

await (async () => {
	const gzip = await promisify(exec)(`gzip --stdout ${lib}`)
		.then(({stdout}) => stdout.length)
	const brotli = await promisify(exec)(`brotli --stdout ${lib}`)
		.then(({stdout}) => stdout.length)
	Object.assign(version.size, {gzip, brotli})
	const print = gzip < 5000 ? printOk : printFail
	print(`Gzipped: ${gray(gzip.toString())} bytes`)
	printOk(`Brotli'd: ${gray(brotli.toString())} bytes`)
})()

await (async () => {
	const bytes = await readFile(lib)
	const hash = createHash('MD5').update(bytes).digest('base64')
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
	const correct = await confirm('  Continue?')
	if(correct) return version.number = guess
	let number
	while(true){
		number = await ask('  Enter version number:')
		const exists = versions.some(version => version.number == number)
		if(number && !exists) break
		printFail(`Version "${number}" already exists.`)
	}
	version.number = number
})()

await (async () => {
	const message = '  Are you sure you want to archive a new version?'
	const sure = await confirm(message)
	if(!sure) return printFail('Operation cancelled. Exiting…')
	await cp(lib, `archive/lib-${version.number}.js`)
	const devSource = `// Yozo version: ${version.number}\n`
		+ (await readFile(dev, 'utf8'))
	await writeFile(`archive/dev-${version.number}.js`, devSource)
	versions.unshift(version)
	const stringified = JSON.stringify(versions, null, 4)
	console.log(version)
	await writeFile('versions.json', stringified)
	const packageJson = await readFile('package.json', 'utf8')
	const updatedPackageJson = packageJson
		.replace(/"version": "[^"]*"/, `"version": "${version.number}"`)
	await writeFile('package.json', updatedPackageJson)
	printOk(`Version ${version.number} archived successfully.`)
})()

readline.close()
