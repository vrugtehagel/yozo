import { copy, walk } from 'std/fs/mod.ts'
import { red } from 'std/fmt/colors.ts'
import { csml, addFlagToTag, addTransform } from 'csml/mod.ts'


addFlagToTag('ui-code', ':indent(0, 1)')
addFlagToTag('script', ':indent(0, 1)')

addTransform('badge', text => {
	return text.replaceAll(/\[\[\b(.*?)\b\]\]/g, '<span class=badge>$1</span>')
})


export async function runCSML(){
	await Deno.mkdir('dist', {recursive: true})
	await copy('site', 'dist', {overwrite: true})
	await runPages()
	await createTestPages()
	await removeCSMLFiles()
}

async function runPage(url){
	try {
		const html = await csml.render('dist/-/csml/root.csml', {url})
		const out = url.replace(/\.csml$/, '.html')
		await Deno.writeTextFile(out, html)
	} catch(error) {
		console.log(`${red('Error:')} ${error.message}`)
	}
}

async function runPages(){
	const exts = ['csml']
	const skip = [/\/-\//]
	const includeDirs = false
	const promises = []
	for await(const entry of walk('dist', {exts, skip, includeDirs}))
		promises.push(runPage(entry.path))
	await Promise.all(promises)
}

async function createTestPage(url){
	const options = {url: 'dist/-/csml/test.csml', layoutArgs: {url}}
	const html = await csml.render('dist/-/csml/root.csml', options)
	const directory = url.replace(/\.tks$/, '')
	await Deno.mkdir(directory, {recursive: true})
	await Deno.writeTextFile(`${directory}/index.html`, html)
}

async function createTestPages(){
	const exts = ['tks']
	const skip = [/\/-\//]
	const includeDirs = false
	const promises = []
	for await(const entry of walk('dist', {exts, skip, includeDirs}))
		promises.push(createTestPage(entry.path))
	await Promise.all(promises)
}

async function removeCSMLFiles(){
	const exts = ['csml']
	const includeDirs = false
	for await(const entry of walk('dist', {exts, includeDirs}))
		await Deno.remove(entry.path).catch(() => null)
}
