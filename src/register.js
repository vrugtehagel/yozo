import { define } from './define.js'
import { when } from './when.js'
import { camelCase, uniqueName } from './utils.js'

export const register = async url => {
	const response = await fetch(url)
	if(!response.ok) return
	const add = uniqueName()
	const defineArg = uniqueName()
	const template = document.createElement('template')
	template.innerHTML = await response.text()
	return new Function(defineArg, `return ${defineArg}(${add}=>{` +
		`var{${Object.keys(self.yozo)}}=self.yozo;${
		[...template.content.children].map(element =>
			`${add}[\`${element.localName}\`]?.({${
			 [...element.attributes].map(attribute => 
			 	`${camelCase(attribute.name)}:` + 
			 		`\`${attribute.value.replace(/[`$]/g, '\\$&')}\``)
			 }},${
			 	element.localName == 'script'
					? `function({${define.public}}){${element.innerHTML}}`
					: `\`${element.innerHTML.replace(/[`$]/g, '\\$&')}\``
			})`
		)}})`
	)(define)
}

let initiated
let cancelled
register.auto = find => {
	if(initiated) return
	initiated = new Set
	const autoDefine = name => {
		if(initiated.has(name)) return
		initiated.add(name)
		const url = find(name)
		if(url) register(url)
	}
	define.register(6, null, context => {
		if(cancelled) return {}
		if(!context.template) return {}
		for(const element of context.template.querySelectorAll(':not(:defined)'))
			autoDefine(element.localName)
		return {}
	}, {})
	return when(document).observes('mutation', {childList: true, subtree: true}).then(entries => {
		for(const node of document.querySelectorAll(':not(:defined)')){
			if(initiated.has(node.localName)) continue
			autoDefine(node.localName)
		}
	}).if(() => null).after(() => {
		for(const element of document.querySelectorAll(':not(:defined)'))
			autoDefine(element.localName)
	}).cleanup(() => cancelled = true)

}
