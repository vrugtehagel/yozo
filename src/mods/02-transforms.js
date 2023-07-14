import { define } from '../define.js'
import { live } from '../live.js'
import { track } from '../track.js'
import { when } from '../when.js'
import { S, camelCase, uniqueName } from '../utils.js'


define.register(2, Symbol(), context => {
	const constructor = function(meta){
		meta.function = (expression, ...scopes) => {
			const variables = scopes.map(() => uniqueName())
			const result = new Function(...variables,
				`var ${scopes.map((scope, index) => `${scope[0]}=${variables[index]}`)}` +
				`;return(${expression})`
			)
			return (thisArg, ...scopes) =>
				result.call(thisArg, ...scopes.map(scope => scope[1]))
		}
		meta.render = (node, ...scopes) => track.ignore(() => {
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
	}
	return {constructor}
})
