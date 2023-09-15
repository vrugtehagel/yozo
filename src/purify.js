import { track } from './track.js'

export const purify = callback => {
	let call
	return (...args) => {
		call?.undo()
		call = track.undo(() => callback(...args))
		return call.result
	}
}
