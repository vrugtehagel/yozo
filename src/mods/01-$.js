import { define } from '../define.js'
import { live } from '../live.js'


define.register(1, Symbol(), context => {
	const constructor = function(meta){
		meta.$ = live({})
	}
	return {constructor}
})
