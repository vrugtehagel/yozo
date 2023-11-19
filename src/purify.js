import { monitor } from './monitor.js'

export const purify = callback => {
	let call
	return (...args) => {
		call?.undo()
		call = monitor(['undo'], () => callback(...args))
		return call.result
	}
}
