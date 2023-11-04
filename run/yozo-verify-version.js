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

async function computeChecksum(){
	const bytes = await Deno.readFile('dist/lib-latest.js')
	const hash = encodeBase64(await crypto.subtle.digest('MD5', bytes))
	return hash
}

async function verifyChecksum(version, {quiet}){
	const hash = await computeChecksum()
	if(version.hash == hash) return true
	if(quiet) return false
	console.log(red(`Checksum mismatch for version ${version.number}!`))
	console.log('If this is a new version, run:')
	console.log('\tdeno task build-version --version-number="…"')
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

async function fixChangelog(number){
	const json = await Deno.readTextFile('archive/versions.json')
	const hash = await computeChecksum()
	await Deno.writeTextFile('archive/versions.json', `[{
		"number": "${number}",
		"hash": "${hash}",
		"timestamp": ${Date.now()},
		"changelog": {
			"breaking": [],
			"improvements": [],
			"bugs": []
		}
	}, `.replaceAll(/^\t/gm, '') + json.slice(1))
}

async function fixArchived(number){
	await Deno.copyFile('dist/lib-latest.js', `archive/lib-${number}.js`)
	await Deno.copyFile('dist/dev-latest.js', `archive/dev-${number}.js`)
}

export async function fixMissingVersion(number){
	await fixChangelog(number)
	await fixArchived(number)
}
