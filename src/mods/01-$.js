import { define } from '../define.js'
import { live } from '../live.js'


define.register(1, Symbol(), context => {
	context.x.add('$')
	const constructor = function(meta){
		meta.x.$ = live({})
	}
	return {constructor}
})
