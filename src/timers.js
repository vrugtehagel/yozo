import { Flow } from './flow.js'


/**
 * Create a `Flow` equivalent to a `setInterval()`.
 * {@link https://yozo.ooo/docs/interval/}
 */
export const interval = duration => {
	let id
	return new Flow(trigger => id = setInterval(trigger, duration))
		.cleanup(() => clearInterval(id))
}

/**
 * Create a `Flow` equivalent to a `setTimeout()`.
 * {@link https://yozo.ooo/docs/timeout/}
 */
export const timeout = duration => interval(duration).once()

/**
 * Create a `Flow` equivalent to a nested `requestAnimationFrame()`.
 * {@link https://yozo.ooo/docs/frame/}
 */
export const frame = () => {
	let id
	return new Flow(trigger => {
		const next = () => id = requestAnimationFrame(time => {
			next()
			trigger(time)
		})
		next()
	}).cleanup(() => cancelAnimationFrame(id))
}

/**
 * Create a `Flow` that triggers once after the browser has painted.
 * {@link https://yozo.ooo/docs/paint/}
 */
export const paint = () => {
	// Bit of a weird way to do it but this basically means frame().twice()
	let count = 0
	return frame().if(() => count++).once()
}
