export default {
	'never': {
		type: Error,
		message: 'This is a hypothetical error. It should never happen.',
		help: 'If it keeps happening, please file an issue for it.'
	},
	'return-in-script': {
		type: SyntaxError,
		message: 'Cannot return in a <script>.'
	},
	'observer-not-found': {
		type: TypeError,
		message: 'Failed at when(...).observe(\'{type}\').',
		help: 'This occurred because "{name}" doesn\'t exist.'
	},
	'target-not-event-target': {
		type: TypeError,
		message: 'Could not attach event listener(s) with when(...).',
		help: 'One of its arguments was not an EventTarget.'
	},
	'triggered-dead-thennable': {
		type: Error,
		message: 'Potential memory leak; a dead thennable was triggered.',
		help: 'Make sure you use .cleanup() to detach handlers to avoid leaks.'
	},
	'unsafe-watched-value': {
		type: TypeError,
		message: 'Setting watched property "{key}" is unsafe, because it is a utility method.',
		help: 'You may access it using .${key}.get(), but renaming it is advised.'
	},
	'no-title': {
		type: TypeError,
		message: 'Your components need a <title>. This determines their name.'
	}
}
