import { track } from './track.js'

export const purify = callback => {
	let call
	return (...args) => {
		call?.flows.stop()
		call = track.flows(() => callback(...args))
		return call.result
	}
}
