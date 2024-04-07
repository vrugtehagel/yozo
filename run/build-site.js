import { green, red } from 'std/fmt/colors.ts'

import { runCSML } from './site-run-csml.js'


export async function buildSite(){
	try {
		await runCSML()
		console.log(`${green('✓')} Site build complete.`)
	} catch(e) {
		console.log(e)
		console.log(`${red('✘')} Site build failed.`)
	}
}

if(import.meta.main) await buildSite()
