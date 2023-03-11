import Reference from './reference.js'

export default function watch(thing){
	return new Reference({value:
		{$: watch.get(thing)}
	}, '$').out
}

