import { green, yellow, red } from 'std/fmt/colors.ts'
import { walk, copy } from 'std/fs/mod.ts'
import { parse } from 'std/flags/mod.ts'
import * as esbuild from 'esbuild/mod.js'
import { crypto } from 'std/crypto/mod.ts'
import { encodeBase64 } from 'std/encoding/base64.ts'

// Import Yozo so that Deno's --watch flag lets us rebuild on change
import '../src/index.js'

const outdir = 'latest'

// For the lib build, we ignore all lines with a // comment in it.
// That means we can have dev-only code as long as we end lines with a comment.
// To build, we clone the whole codebase into a temporary directory, and remove
// the lines with a comment in it.
async function buildLib(){
	const dir = await Deno.makeTempDir();
	await copy('src', dir, {overwrite: true})
	for await(const {isFile, path} of walk(dir)){
		if(!isFile) continue
		const content = await Deno.readTextFile(path)
		const transformed = content.replaceAll(/^.*\/\/$/mg, '')
		await Deno.writeTextFile(path, transformed)
	}
	const bundle = true
	const logLevel = 'warning'
	const minify = true
	const mangleProps = /^__/
	const entryPoints = [{in: `${dir}/index.js`, out: 'lib'}]
	const options = {outdir, bundle, logLevel, entryPoints, minify, mangleProps}
	await esbuild.build(options)
	esbuild.stop()
	await Deno.remove(dir, {recursive: true})
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
	await Deno.remove(`${outdir}/dev.js`).catch(() => null)
	await Deno.remove(`${outdir}/lib.js`).catch(() => null)
	await buildDev()
	await buildLib()
	if(options.verify) await verify()
	const args = ['--stdout', `${outdir}/lib.js`]
	const command = new Deno.Command('gzip', {args})
	const result = await command.output().catch(() => null)
	if(!result) throw Error('Failed to gzip lib.js.')
	const size = result.stdout.length
	const color = size >= 5000 ? red : size >= 4750 ? yellow : green
	const sizeText = `${color(size.toString())}b gzipped`
	console.log(`${green('✓')} Yozo build complete (${sizeText}).`)
}

// We check that the lib and dev files exist, and that the latest version in
// versions.json matches the hash of the built files
export async function verify(){
	const json = await Deno.readTextFile('versions.json')
	const versions = JSON.parse(json)
	const version = versions[0]
	const lib = `archive/lib-${version.number}.js`
	const libExists = await Deno.stat(lib).catch(() => null)
	if(!libExists) throw Error(`"${lib}" doesn't exist`)
	const dev = `archive/dev-${version.number}.js`
	const devExists = await Deno.stat(dev).catch(() => null)
	if(!devExists) throw Error(`"${dev}" doesn't exist`)
	const bytes = await Deno.readFile(`${outdir}/lib.js`)
	const hash = encodeBase64(await crypto.subtle.digest('MD5', bytes))
	const hashMatches = version.hash == hash
	if(!hashMatches) throw Error(`Checksum mismatch for ${version.number}`)
}

if(import.meta.main){
	const args = parse(Deno.args)
	const verify = args['verify']
	await build({verify})
}
