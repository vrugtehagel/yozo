export const html = (...args) => 
	document.createRange().createContextualFragment(String.raw(...args))
