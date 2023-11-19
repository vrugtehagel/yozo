import { define } from '../define.js'
import { monitor } from '../monitor.js'
import { S, camelCase } from '../utils.js'


define.register(3, Symbol(), context => {
	const constructor = function(meta){
		meta.__function = (expression, ...scopes) => {
			const variables = scopes.map(() => `$${camelCase(crypto.randomUUID())}`)
			const result = new Function(...variables,
				`var ${scopes.map((scope, index) => `${scope[0]}=${variables[index]}`)}` +
				`;return(${expression})`
			)
			return (thisArg, ...scopes) =>
				result.call(thisArg, ...scopes.map(scope => scope[1]))
		}
		meta.__render = (node, ...scopes) => monitor.ignore(() => {
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
