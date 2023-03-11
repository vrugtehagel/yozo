export default function html(...args){
	return args[0].raw
		? document.createRange().createContextualFragment(String.raw(...args))
		: document.createRange().createContextualFragment(args[0]).children[0]
}
