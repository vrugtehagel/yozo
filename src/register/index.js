import { define } from '../define/index.js'
import { transpile } from './transpile.js'

import { when } from '../when.js'

export const register = async url => {
	const response = await fetch(url)
	if(!response.ok) return
	const AsyncFunction = (async function(){}).constructor
	const text = await response.text()
	return await (new AsyncFunction(transpile(text)))()
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

	define.register(3, null, context => {
		if(cancelled) return {}
		for(const element of context.template.querySelectorAll(':not(:defined)'))
			autoDefine(element.localName)
		return {}
	}, {})

	return when(document).observes('mutation', {childList: true, subtree: true}).then(entries => {
		for(const entry of entries) for(const node of entry.addedNodes){
			if(!node.localName?.includes('-')) continue
			if(initiated.has(node.localName)) continue
			if(node.matches(':not(:defined)')) autoDefine(node.localName)
			else initiated.add(node.localName)
		}
	}).if(() => false).after(() => {
		for(const element of document.querySelectorAll(':not(:defined)'))
			autoDefine(element.localName)
	}).cleanup(() => cancelled = true)

}
