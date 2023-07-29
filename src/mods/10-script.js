import { define } from '../define.js'
import { uniqueName } from '../utils.js'


define.register(10, 'script', (context, [args]) => {
	if(!args) return {}
	const callback = new Function(`{${[...context.x]}}`, `const{${Object.keys(self.yozo)}}=self.yozo;${args[1]}`)
	const constructor = function(meta){
		callback.call(this, meta.x)
	}
	return {constructor}
})
