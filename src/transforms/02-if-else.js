import { warn } from '../help.js' //
import { define } from '../define.js'
import { effect } from '../effect.js'

define.transform(2, (node, scopes, meta, context) => {
	if(node.nodeType != 2) return
	if(node.name == '#else-if' || node.name == '#else') //
		warn`transform-if-found-loose-${node.name}` //
	if(node.name != '#if') return
	node.ownerElement.before('')
	const anchor = node.ownerElement.previousSibling
	const expressions = []
	const ifElseChain = []
	let logicNode = anchor
	const consume = statement => {
		if(!logicNode.nextElementSibling?.hasAttribute(statement)) return
		logicNode = logicNode.nextElementSibling
		expressions.push(`()=>(${logicNode.getAttribute(statement)})`)
		ifElseChain.push(logicNode.localName == 'template'
			? logicNode.content
			: logicNode)
		logicNode.removeAttribute(statement)
		return true
	}
	consume('#if')
	while(consume('#else-if'));
	if(consume('#else')) expressions[expressions.length - 1] = `()=>1`
	while(anchor.nextSibling != logicNode) anchor.nextSibling.remove()
	logicNode.remove()
	let connectedIndex
	const getter = meta.__function(`[${expressions}].findIndex(e=>e())`, ...scopes)
	meta.x.connected(() => effect(() => {
		const index = getter(null, ...scopes)
		if(index == connectedIndex) return
		connectedIndex = index
		meta.__anchoredRemove(anchor)
		if(!ifElseChain[index]) return
		const node = meta.__render(ifElseChain[index], ...scopes)
		meta.__anchoredAdd(anchor, node.nodeType == 11 ? node.childNodes : [node])
	}))
})
