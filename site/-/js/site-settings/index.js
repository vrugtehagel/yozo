const {live, when} = self.yozo

export const $settings = live({})

const parseBoolean = value => value == 'true'
const fromStorage = ($live, name, fallback, parse) => {
	parse ??= value => value
	if(localStorage.getItem(name) == null) localStorage.setItem(name, fallback)
	const get = () => parse(localStorage.getItem(name))
	const set = value => localStorage.setItem(name, value)
	const changes = when(window).storages().if(({key}) => key == name)
	live.link($live, {get, set, changes})
}
fromStorage($settings.$semicolons, 'settings:semicolons', true, parseBoolean)
fromStorage($settings.$useTabs, 'settings:use-tabs', true, parseBoolean)
fromStorage($settings.$tabSize, 'settings:tab-size', 4, Number)
fromStorage($settings.$lineNumbers, 'settings:line-numbers', true, parseBoolean)

live.link($settings.$indent, () => {
	if($settings.useTabs) return '\t'
	return ' '.repeat($settings.tabSize)
})

export function format(code, language){
	code = code.replace(/^\s+\n|\n\s+$/, '')
	const indent = $settings.indent
	if(indent != '\t')
		code = code.replaceAll(/^\t+/gm, match => indent.repeat(match.length))
	if($settings.semicolons) return code
	if(language == 'js') return code.replaceAll(/;(?=\s*?(?:\/\/.*)?$)/gm, '')
	if(!['yz', 'html'].includes(language)) return code
	const semicolonsInsideScripts =
		/;(?=[^\S\n]*(?:\/\/.*)?$)(?=(?:[^](?!<script>))*<\/script>)/gm
	return code.replaceAll(semicolonsInsideScripts, '')
}
