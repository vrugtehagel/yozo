import { parse } from 'std/flags/mod.ts'

import { buildYozo } from './build-yozo.js'
import { fixMissingVersion } from './yozo-verify-version.js'

export async function buildVersion(number){
	await Deno.remove('dist', {recursive: true}).catch(() => null)
	await buildYozo()
	await fixMissingVersion(number)
}


const args = parse(Deno.args)
if(!args['version-number'])
	throw Error(`Use the --version-number=… flag to build a missing version`)

await buildVersion(args['version-number'])
