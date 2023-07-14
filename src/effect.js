import { Flow } from './flow.js'
import { track } from './track.js'
import { when } from './when.js'

export const effect = (callback, schedule = queueMicrotask) => {
	let updater
	const flow = new Flow
	flow.then(() => {
		const call = track(['live', 'flows'], callback)
		updater = track.ignore(() => when(call.live).change()).once()
			.then(() => schedule(() => flow.now()))
			.cleanup(() => call.flows.stop())
	}).cleanup(() => updater?.stop())
	schedule(() => flow.now())
	return flow
}
