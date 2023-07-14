import { define } from '../define.js'
import { kebabCase } from '../utils.js'


// define.public.push('elements')
define.register(7, Symbol(), context => {
	const constructor = function(meta){
		const cache = {
			all: selector => [...meta.root.querySelectorAll(selector)],
			shadow: meta.root.mode ? meta.root : null
		}
		meta.elements = new Proxy(selector => meta.root.querySelector(selector), {
			get: (find, name) =>
				cache[name] ??= find(`#${kebabCase(name)},#${name}`) ?? find(kebabCase(name))
		})
	}
	return {constructor}
})
