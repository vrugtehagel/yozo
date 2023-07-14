import { define } from '../define.js'
import { effect } from '../effect.js'


define.transform(0, (node, scopes, meta, context) => {
	if(node.nodeType != 3) return
	const parts = node.textContent.split(/{{([^]*?)}}/g)
	node.before(...parts)
	let current = node
	for(let index = 1; index < parts.length; index += 2){
		current = current.previousSibling.previousSibling
		const node = current
		const getter = meta.function(node.textContent, ...scopes)
		meta.connect(() => effect(() => {
			node.textContent = getter(null, ...scopes)
		}))
	}
	node.remove()
})
