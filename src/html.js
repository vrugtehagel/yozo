export const html = (...args) => args[0].raw
	? document.createRange().createContextualFragment(String.raw(...args))
	: document.createRange().createContextualFragment(args[0]).children[0]
