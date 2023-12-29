import { Flow } from './flow.js'


// Converting timers to flows
export const interval = duration => {
	let id
	return new Flow(trigger => id = setInterval(trigger, duration))
		.cleanup(() => clearInterval(id))
}

export const timeout = duration => interval(duration).once()

// Wrapper for a nested requestAnimationFrame()
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

// Wait for browser to have painted; specifically, wait two animation frames
export const paint = () => {
	// Bit of a weird way to do it but this basically means frame().twice()
	let count = 0
	return frame().if(() => count++).once()
}
