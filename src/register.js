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
	return define(add => {
		for(const element of template.content.children){
			add[element.localName]?.(
				Object.fromEntries([...element.attributes].map(attribute => 
				 	[camelCase(attribute.name), attribute.value])),
				element.innerHTML
			)
		}
	})
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
	const from = root => {
		for(const element of root.querySelectorAll(':not(:defined)'))
			autoDefine(element.localName)
		for(const template of root.querySelectorAll('template'))
			from(template.content)
	}
	define.register(6, null, context => {
		if(cancelled) return {}
		if(!context.__template) return {}
		from(context.__template)
		return {}
	}, {})
	return when(document).observes('mutation', {childList: true, subtree: true})
		.then(() => from(document))
		.now()
		.if(() => null)
		.cleanup(() => cancelled = true)
}
