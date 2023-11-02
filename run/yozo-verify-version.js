import { crypto } from 'std/crypto/mod.ts'
import { encodeBase64 } from 'std/encoding/base64.ts'
import { red } from 'std/fmt/colors.ts'


async function verifyArchived(version, {quiet}){
	const archived = await Deno.stat(`archive/lib-${version.number}.js`)
		.catch(() => null)
	if(archived?.isFile) return true
	if(quiet) return false
	console.log(`Archive is missing the latest version (${version.number}).`)
	return false
}

async function verifyChecksum(version, {quiet}){
	const json = await Deno.readTextFile('archive/versions.json')
	const versions = JSON.parse(json)
	const bytes = await Deno.readFile('dist/lib-latest.js')
	const hash = encodeBase64(await crypto.subtle.digest('MD5', bytes))
	const checksumMatches = version.hash == hash
	if(checksumMatches) return true
	if(quiet) return false
	console.log(red(`Checksum mismatch for version ${version.number}!`))
	console.log(`\tExpected: ${version.hash}`)
	console.log(`\tReceived: ${hash}`)
	console.log('If this is a new version, update archive/versions.json.')
	console.log('Also, include the new builds in archive/.')
	return false
}

export async function verifyVersion({quiet} = {}){
	const json = await Deno.readTextFile('archive/versions.json')
	const versions = JSON.parse(json)
	const version = versions[0]
	const checksumOk = await verifyChecksum(version, {quiet})
	const archivedOk = await verifyArchived(version, {quiet})
	return checksumOk && archivedOk
}
