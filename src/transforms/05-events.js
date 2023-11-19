import { define } from '../define.js'
import { effect } from '../effect.js'
import { when } from '../when.js'
import { monitor } from '../monitor.js'


define.transform(5, (node, scopes, meta, context) => {
	if(node.nodeType != 2) return
	if(node.name[0] != '@') return
	const element = node.ownerElement
	const type = node.name.slice(1)
	element.removeAttribute(node.name)
	const handler = meta.__function(node.value, ...scopes, ['event'])
	meta.x.connected(() => {
		when(element).does(type).then(event => {
			monitor.ignore(() => handler(element, ...scopes, ['event', event]))
		})
	})
})
