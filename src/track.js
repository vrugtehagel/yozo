let current

export default function track(callback){
	const before = current
	current = Object.fromEntries(
		Object.keys(registry).map(name => [name, registry[name].bucket()])
	)
	const result = callback()
	const call = Object.fromEntries(
		Object.keys(registry).map(name => [name, registry[name].transform(current[name])])
	)
	current = before
	call.result = result
	return call
}

track.ignore = callback => {
	const before = current
	current = null
	const result = callback()
	current = before
	return result
}

track.define = definition => function(...args){
	const {result, ...things} = definition.apply(this, args)
	if(current) for(const key of Object.keys(things))
		registry[key]?.add(current[key], things[key])
	return result
}

track.register = (name, registration) => {
	if(name == 'result') return
	registry[name] ??= registration
}

const registry = {
	undo: {
		bucket: () => [],
		add: (bucket, undo) => bucket.unshift(undo),
		transform: bucket => () => bucket.splice(0).forEach(track.ignore)
	},
	watched: {
		bucket: () => new Set,
		add: (bucket, variable) => bucket.add(variable),
		transform: bucket => bucket
	}
}
