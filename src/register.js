import { define } from './define.js'
import { when } from './when.js'
import { camelCase, R } from './utils.js'

export const register = async url => {
	if(register[R].has(`${url}`)) return
	register[R].add(`${url}`)
	const response = await fetch(url)
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
register[R] = new Set

let cancelled
register.auto = find => {
	if(register.auto[R]) return
	register.auto[R] = new Set
	const autoDefine = name => {
		if(register.auto[R].has(name)) return
		register.auto[R].add(name)
		const url = find(name)
		if(!url) return
		register(url)
	}
	const from = root => {
		for(const element of root.querySelectorAll(':not(:defined)'))
			autoDefine(element.localName)
		for(const template of root.querySelectorAll('template'))
			from(template.content)
	}
	define.register(6, Symbol(), context => {
		if(cancelled) return {}
		if(context.__template) from(context.__template)
		return {}
	}, {})
	return when(document).observes('mutation', {childList: true, subtree: true})
		.then(() => from(document))
		.now()
		.if(() => null)
		.cleanup(() => cancelled = true)
}
