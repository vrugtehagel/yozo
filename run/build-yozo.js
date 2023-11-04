import { green, yellow, red, gray } from 'std/fmt/colors.ts'
import { parse } from 'std/flags/mod.ts'

import { getSizeInfo } from './yozo-get-size-info.js'
import { bundle } from './yozo-bundle.js'
import { verifyVersion } from './yozo-verify-version.js'


export async function buildYozo(){
	try {
		await bundle()
		const args = parse(Deno.args)
		if(!args['no-verify']){
			const ok = await verifyVersion()
			if(!ok) throw Error('Version verification failed.')
		}
	} catch(e) {
		console.log(`${red('✘')} Yozo build failed.`)
		Deno.exit(1)
	}

	try {
		const info = getSizeInfo()
		const text = info.types.map(type => type.text).join(', ')
		if(info.status == 'ok')
			console.log(`${green('✓')} Yozo build complete (${text}).`)
		else console.log(`${red('✘')} Yozo build failed (${text}).`)
	} catch {
		console.log('Size info check threw an error.')
		console.log(`${red('✘')} Yozo build failed.`)
		Deno.exit(1)
	}
}

if(import.meta.main) await buildYozo()
