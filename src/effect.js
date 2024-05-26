import { Flow } from './flow.js'
import { monitor } from './monitor.js'
import { when } from './when.js'


/**
 * Run an effect, which re-runs whenever its live dependencies change.
 * {@link https://yozo.ooo/docs/effect/}
 */
export const effect = (callback, schedule = queueMicrotask) => {
	let call
	const run = () => schedule(() => flow.now())
	const flow = (new Flow).then(() => {
		call?.undo()
		call = monitor(['undo', 'live'], callback)
		call.live.addEventListener('change', run, {once: true})
	}).cleanup(() => {
		call?.undo()
		call?.live.removeEventListener('change', run, {once: true})
	})
	// We can't schedule before creating the flow because schedule
	// can be synchronous: updater => updater()
	run()
	return flow
}
