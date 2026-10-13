import * as fs from 'node:fs/promises'
import {parseArgs, promisify} from 'node:util'
import {createHash} from 'node:crypto'
import {exec} from 'node:child_process'
import * as esbuild from 'esbuild-wasm'


// Import Yozo so that Node's --watch flag lets us rebuild on change
import '../src/index.js'

const outdir = 'latest'

// Colors!
const green = text => `\x1b[32m${text}\x1b[0m`
const yellow = text => `\x1b[33m${text}\x1b[0m`
const red = text => `\x1b[31m${text}\x1b[0m`

// For the lib build, we ignore all lines with a // comment in it.
// That means we can have dev-only code as long as we end lines with a comment.
// To build, we clone the whole codebase into a temporary directory, and remove
// the lines with a comment in it.
async function buildLib(){
	const dir = await fs.mkdtemp('temp')
	await fs.cp('src', dir, {recursive: true})
	for await(const path of fs.glob(`${dir}/**/*.js`)){
		const content = await fs.readFile(path, 'utf8')
		const transformed = content.replaceAll(/^.*\/\/$/mg, '')
		await fs.writeFile(path, transformed)
	}
	const bundle = true
	const logLevel = 'warning'
	const minify = true
	const mangleProps = /^__/
	const entryPoints = [{in: `${dir}/index.js`, out: 'lib'}]
	const options = {outdir, bundle, logLevel, entryPoints, minify, mangleProps}
	await esbuild.build(options)
	esbuild.stop()
	await fs.rm(dir, {recursive: true})
}

// The dev build just builds src/
async function buildDev(){
	const bundle = true
	const logLevel = 'warning'
	const entryPoints = [{in: `src/index.js`, out: 'dev'}]
	await esbuild.build({outdir, bundle, logLevel, entryPoints})
	esbuild.stop()
}

export async function build(options = {}){
	await fs.rm(`${outdir}/dev.js`).catch(() => null)
	await fs.rm(`${outdir}/lib.js`).catch(() => null)
	await buildDev()
	await buildLib()
	if(options.verify) await verify()
	const command = `gzip --stdout ${outdir}/lib.js`
	const result = await promisify(exec)(command).catch(() => null)
	if(!result) throw Error('Failed to gzip lib.js.')
	const size = result.stdout.length
	const color = size >= 5000 ? red : size >= 4750 ? yellow : green
	const sizeText = `${color(size.toString())}b gzipped`
	console.log(`${green('✓')} Yozo build complete (${sizeText}).`)
}

// We check that the lib and dev files exist, and that the latest version in
// versions.json matches the hash of the built files
export async function verify(){
	const json = await fs.readFile('versions.json', 'utf8')
	const versions = JSON.parse(json)
	const version = versions[0]
	const lib = `archive/lib-${version.number}.js`
	const libExists = await fs.stat(lib).catch(() => null)
	if(!libExists) throw Error(`"${lib}" doesn't exist`)
	const dev = `archive/dev-${version.number}.js`
	const devExists = await fs.stat(dev).catch(() => null)
	if(!devExists) throw Error(`"${dev}" doesn't exist`)
	const bytes = await fs.readFile(`${outdir}/lib.js`)
	const hash = createHash('MD5').update(bytes).digest('base64')
	const hashMatches = version.hash == hash
	if(!hashMatches) throw Error(`Checksum mismatch for ${version.number}`)
}

if(import.meta.main){
	const args = parseArgs({options: {verify: {type: 'boolean'}}})
	const {verify} = args.values
	await build({verify})
}
