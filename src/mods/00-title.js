import { error } from '../help.js' //
import { define } from '../define.js'


define.register(0, 'title', (context, [args]) => {
	if(!args?.[1]) error`define-missing-title` //
	context.__title = args[1]
	return {}
})
