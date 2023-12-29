import { Flow } from './flow.js'
import { monitor } from './monitor.js'
import { when } from './when.js'


// Listen for changes in live variable and re-run when something changes
export const effect = (callback, schedule = queueMicrotask) => {
	let updater
	const flow = (new Flow).then(() => {
		const call = monitor(['undo', 'live'], callback)
		updater = monitor.ignore(() => when(call.live).change()).once()
			.then(() => schedule(() => flow.now()))
			.cleanup(() => call.undo())
	}).cleanup(() => updater?.stop())
	// We can't schedule before creating the flow because schedule
	// can be synchronous: updater => updater()
	schedule(() => flow.now())
	return flow
}
