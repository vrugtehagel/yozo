import { error } from '../help.js' //
import { define } from '../define.js'


// <title>…</title>

define.register(0, 'title', (context, [args]) => {
	// If there is no title, then an error will occur later when we try to
	// define the element using customElements.define()
	// So better throw the error here
	if(!args?.[1]) error`define-missing-title` //
	context.__title = args[1]
	return {}
})
