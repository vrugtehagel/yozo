import { walk } from 'std/fs/mod.ts'
import * as esbuild from 'esbuild/mod.js'


const libDir = 'dist/temp'


export async function bundle(){
	await Deno.mkdir(libDir, {recursive: true})
	await generateYozoLib()
	await buildYozo()
	await Deno.remove(libDir, {recursive: true})
}

async function generateYozoLib(){
	for await(const entry of walk('src')){
		if(entry.path == 'src/') continue
		const path = `${libDir}/${entry.path.slice('src/'.length)}`
		if(entry.isDirectory){
			await Deno.mkdir(path, {recursive: true})
			continue
		}
		const text = await Deno.readTextFile(entry.path)
		const transformed = text.replaceAll(/^.*\/\/$/mg, '')
		await Deno.writeTextFile(path, transformed, {create: true})
	}
}

async function buildYozo(){
	const lib = {out: 'lib-latest', in: `${libDir}/index.js`}
	const dev = {out: 'dev-latest', in: 'src/index.js'}
	await esbuild.build({
		bundle: true,
		outdir: 'dist',
		entryPoints: [lib, dev],
		minify: true,
		mangleProps: /^__/,
		logLevel: 'warning'
	})
	esbuild.stop()
}
