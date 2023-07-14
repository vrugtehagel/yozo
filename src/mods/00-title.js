import { define } from '../define.js'


define.register(0, 'title', (context, [args]) => {
	context.title = args[1]
	return {}
})
