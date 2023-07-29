import { define } from '../define.js'
import { kebabCase } from '../utils.js'


define.register(7, Symbol(), context => {
	context.x.add('elements')
	const constructor = function(meta){
		const cache = {
			all: selector => [...meta.root.querySelectorAll(selector)],
			shadow: meta.root.mode ? meta.root : null
		}
		meta.x.elements = new Proxy(selector => meta.root.querySelector(selector), {
			get: (find, name) =>
				cache[name] ??= find(`#${kebabCase(name)},#${name}`) ?? find(kebabCase(name))
		})
	}
	return {constructor}
})
