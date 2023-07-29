import { define } from '../define.js'
import { track } from '../track.js'
import { S, camelCase, uniqueName } from '../utils.js'


define.register(2, Symbol(), context => {
	const constructor = function(meta){
		meta.__function = (expression, ...scopes) => {
			const variables = scopes.map(() => uniqueName())
			const result = new Function(...variables,
				`var ${scopes.map((scope, index) => `${scope[0]}=${variables[index]}`)}` +
				`;return(${expression})`
			)
			return (thisArg, ...scopes) =>
				result.call(thisArg, ...scopes.map(scope => scope[1]))
		}
		meta.__render = (node, ...scopes) => track.ignore(() => {
			const root = node.cloneNode(true)
			const iterator = document.createNodeIterator(root, 5)
			let current
			iteration: while(current = iterator.nextNode()){
				if(current.nodeType == 1){
					for(const [callback] of define[S]){
						for(const attribute of [...current.attributes]){
							callback(attribute, scopes, meta, context)
							if(iterator.referenceNode != current) continue iteration
						}
					}
				}
				for(const [callback] of define[S]){
					callback(current, scopes, meta, context)
					if(iterator.referenceNode != current) continue iteration
				}
			}
			return root
		})
		const anchoredNodes = new WeakMap
		meta.__anchoredAdd = (anchor, nodes) => {
			const cached = anchoredNodes.get(anchor) ?? []
			cached.push(...nodes)
			anchoredNodes.set(anchor, cached)
			anchor.after(...nodes)
		}
		meta.__anchoredRemove = anchor => {
			const cached = anchoredNodes.get(anchor)
			if(!cached) return
			for(const node of cached.splice(0)){
				meta.__anchoredRemove(node)
				node.remove()
			}
		}
	}
	return {constructor}
})
