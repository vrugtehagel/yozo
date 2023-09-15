import { define } from '../define.js'
import { live } from '../live.js'
import { effect } from '../effect.js'
import { camelCase } from '../utils.js'

define.transform(4, (node, scopes, meta, context) => {
	if(node.nodeType != 2) return
	if(node.name[0] != '.') return
	const element = node.ownerElement
	element.removeAttribute(node.name)
	const originalLast = node.name.slice(1).split('.').at(-1)
	const chain = node.name.slice(1).split('.').map(camelCase)
	const getter = meta.__function(node.value || true, ...scopes)
	meta.x.connected(() => effect(() => {
		const value = getter(element, ...scopes)
		let current = element
		const properties = [...chain]
		const last = properties.pop()
		for(const property of properties) current = current?.[property]
		if(current instanceof DOMTokenList)
			current.toggle(originalLast, value)
		else if(current != null) current[last] = value
	}))
})
