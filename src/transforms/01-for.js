import { error } from '../help.js' //
import { define } from '../define.js'
import { effect } from '../effect.js'


define.transform(1, (node, scopes, meta, context) => {
	if(node.nodeType != 2) return
	if(node.name != '#for') return
	const element = node.ownerElement
	element.removeAttribute(node.name)
	const [initializer, arrayExpression] = node.value.split(' of ')
	element.before('')
	const anchor = element.previousSibling
	element.remove()
	const cache = []
	const getter = meta.__function(arrayExpression, ...scopes)
	meta.x.connected(() => effect(() => {
		const array = getter(element, ...scopes) //
		if(!array[Symbol.iterator]) //
			error`transform-for-${arrayExpression}-not-iterable` //
		const newNodes = [...(
				true ? array : //
				getter(element, ...scopes)
			)].map((item, index) => {
			if(cache[index] && cache[index][0] === item) return cache[index][1]
			const node = meta.__render(
				element.localName == 'template' ? element.content : element,
				...scopes,
				[initializer, item]
			)
			cache[index] = [item, node.nodeType == 11 ? [...node.childNodes] : [node]]
			return cache[index][1]
		})
		while(cache.length > newNodes.length) cache.pop()
		meta.__anchoredRemove(anchor)
		meta.__anchoredAdd(anchor, newNodes.flat())
	}))
})

