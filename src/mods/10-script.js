import { define } from '../define.js'


define.register(10, 'script', (context, [args]) => {
	if(!args) return {}
	const constructor = function(meta){
		args[1].call(this, meta)
	}
	return {constructor}
})
