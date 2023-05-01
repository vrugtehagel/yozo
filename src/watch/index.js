import { Reference } from './reference.js'

export function watch(thing){
	return new Reference({value:
		{$: watch.get(thing)}
	}, '$').out
}

