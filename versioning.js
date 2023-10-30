import { crypto } from 'std/crypto/mod.ts'
import { encodeBase64 } from 'std/encoding/base64.ts'


const json = await Deno.readTextFile('archive/versions.json')
const versions = JSON.parse(json)

const bytes = await Deno.readFile('dist/lib-latest.js')
const hash = encodeBase64(await crypto.subtle.digest('MD5', bytes))
const version = versions[0]

if(version.hash != hash){
	await Deno.copyFile('dist/lib-latest.js', 'archive/lib-temp.js')
	await Deno.copyFile('dist/dev-latest.js', 'archive/dev-temp.js')
	throw Error(`
		Checksum mismatch for version ${version.number}!
		Expected ${version.hash}, but got ${hash}.
		Add changelog to src/versions.json, including the new hash.
		The new builds should be included in archive/, and for convenience,
		-temp-suffixed files have already been put there.
		Replace the -temp suffix with the new version number.
	`.replaceAll(/^\s*/mg, ''))
}
