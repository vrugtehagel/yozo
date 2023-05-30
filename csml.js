import { expandGlob } from 'std/fs/mod.ts'
import { toFileUrl } from 'std/path/mod.ts'
import { csml, addFlagToTag, addTransform } from 'csml/mod.ts'

addFlagToTag('code-preview', ':indent(0, 1)')

for await(const {path} of expandGlob('./dist/**/*.csml')){
	if(path.includes('/-/')) continue
	const url = toFileUrl(path)
	csml.render(new URL('./dist/-/csml/root.csml', import.meta.url), {url})
		.then(html => Deno.writeTextFile(`${path.slice(0, -5)}.html`, html))
}

