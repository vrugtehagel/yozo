import { define } from '../define.js'


define.register(0, 'title', (context, [args]) => {
	context.__title = args?.[1]
	return {}
})
