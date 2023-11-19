import { Flow } from './flow.js'
import { monitor } from './monitor.js'
import { when } from './when.js'

export const effect = (callback, schedule = queueMicrotask) => {
	let updater
	const flow = new Flow
	flow.then(() => {
		const call = monitor(['live', 'undo'], callback)
		updater = monitor.ignore(() => when(call.live).change()).once()
			.then(() => schedule(() => flow.now()))
			.cleanup(() => call.undo())
	}).cleanup(() => updater?.stop())
	schedule(() => flow.now())
	return flow
}
