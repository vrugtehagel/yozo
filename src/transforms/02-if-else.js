import { define } from '../define.js'
import { effect } from '../effect.js'

define.transform(2, (node, scopes, meta, context) => {
	if(node.nodeType != 2) return
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
	const connectedNodes = []
	let connectedIndex
	const getter = meta.function(`[${expressions}].findIndex(e=>e())`, ...scopes)
	meta.connect(() => effect(() => {
		const index = getter(null, ...scopes)
		if(index == connectedIndex) return
		connectedIndex = index
		connectedNodes.splice(0).forEach(node => node.remove())
		if(!ifElseChain[index]) return
		const node = meta.render(ifElseChain[index], ...scopes)
		connectedNodes.push(...(node.nodeType == 11 ? node.childNodes : [node]))
		anchor.after(...connectedNodes)
	}))
})
