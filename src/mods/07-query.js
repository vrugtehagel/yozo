import { define } from '../define.js'


// query()

define.register(7, Symbol(), context => {
	return {
		constructor: function(meta){
			meta.x.query = selector => meta.root.querySelector(selector)
			meta.x.query.all = selector => [...meta.root.querySelectorAll(selector)]
		}
	}
})
