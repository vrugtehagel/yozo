import { green, red } from 'std/fmt/colors.ts'

import { runCSML } from './site-run-csml.js'
import { mergeArchive } from './site-merge-archive.js'


export async function buildSite(){
	try {
		await runCSML()
		await mergeArchive()
		console.log(`${green('✓')} Site build complete.`)
	} catch(e) {
		console.log(e)
		console.log(`${red('✘')} Site build failed.`)
	}
}

if(import.meta.main) await buildSite()
