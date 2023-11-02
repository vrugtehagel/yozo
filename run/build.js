import { buildYozo } from './build-yozo.js'
import { buildSite } from './build-site.js'


export async function build(){
	await Deno.remove('dist', {recursive: true}).catch(() => null)
	await buildYozo()
	await buildSite()
}

if(import.meta.main) await build()
