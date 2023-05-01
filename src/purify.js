export const purify = fn => {
	let call
	return (...args) => {
		call?.undo()
		call = track.undo(() => fn(...args))
		return call.result
	}
}
