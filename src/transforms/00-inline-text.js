import { define } from '../define.js'
import { effect } from '../effect.js'


define.transform(0, (node, scopes, meta, context) => {
	if(node.nodeType != 3) return
	const parts = node.textContent.split(/{{([^]*?)}}/g)
	node.before(...parts)
	let current = node
	parts.map((part, index) => {
		current = current.previousSibling
		if(index % 2 == 0) return
		const node = current
		const getter = meta.__function(node.textContent, ...scopes)
		meta.x.connected(() => effect(() =>
			node.textContent = getter(null, ...scopes)
		))
	})
	node.remove()
})
