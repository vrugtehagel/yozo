import { monitor } from './monitor.js'


/**
 * Modify a function to clean up its side effects on subsequent calls.
 * {@link https://yozo.ooo/docs/purify/}
 */
export const purify = callback => {
	let call
	return (...args) => {
		call?.undo()
		call = monitor(['undo'], () => callback(...args))
		return call.result
	}
}
