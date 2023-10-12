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
		const array = getter(element, ...scopes)
		if(typeof array?.[Symbol.iterator] != 'function') //
			error`transform-for-${arrayExpression}-not-iterable` //
		while(cache.length > array.length) cache.pop()[1].map(node => node.remove())
		let index = -1
		for(const item of array){
			index++
			if(cache[index] && cache[index][0] === item) continue
			const node = meta.__render(
				element.localName == 'template' ? element.content : element,
				...scopes,
				[initializer, item]
			)
			cache[index]?.[1].map(node => node.remove())
			cache[index] = [item, node.nodeType == 11 ? [...node.childNodes] : [node]]
			;(cache[index - 1]?.[1].at(-1) ?? anchor).after(...cache[index][1])
		}
	}))
})

