import { expandGlob } from 'std/fs/mod.ts'
import { toFileUrl } from 'std/path/mod.ts'
import { csml, addFlagToTag, addTransform } from 'csml/mod.ts'

addFlagToTag('ui-code', ':indent(0, 1)')
addFlagToTag('script', ':indent(0, 1)')

addTransform('badge', text => {
	return text.replaceAll(/\[\[\b(.*?)\b\]\]/g, '<span class=badge>$1</span>')
})

const root = new URL('./dist/-/csml/root.csml', import.meta.url)

for await(const {path} of expandGlob('./dist/**/*.csml')){
	if(path.includes('/-/')) continue
	const url = toFileUrl(path)
	csml.render(root, {url})
		.then(html => Deno.writeTextFile(`${path.slice(0, -5)}.html`, html))
}

