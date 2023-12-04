import { define } from '../define.js'


define.register(7, Symbol(), context => {
	const constructor = function(meta){
		meta.x.query = selector => meta.root.querySelector(selector)
		meta.x.query.all = selector => [...meta.root.querySelectorAll(selector)]
	}
	return {constructor}
})
