import { monitor } from './monitor.js'



// Essentially, wrap a function into another that monitors for 'undo'
// and runs cleanup callbacks before re-running
export const purify = callback => {
	let call
	return (...args) => {
		call?.undo()
		call = monitor(['undo'], () => callback(...args))
		return call.result
	}
}
