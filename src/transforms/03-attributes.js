import { define } from '../define.js'
import { effect } from '../effect.js'


define.transform(3, (node, scopes, meta, context) => {
	if(node.nodeType != 2) return
	if(node.name[0] != ':') return
	const element = node.ownerElement
	const name = node.name.slice(1)
	element.removeAttribute(node.name)
	const getter = meta.__function(node.value, ...scopes)
	meta.x.connected(() => effect(() => {
		const value = getter(element, ...scopes)
		if(value == null) element.removeAttribute(name)
		else element.setAttribute(name, value)
	}))
})
