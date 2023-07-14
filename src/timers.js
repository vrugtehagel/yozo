import { Flow } from './flow.js'

export const interval = duration => {
	let id
	return new Flow(trigger => id = setInterval(trigger, duration))
		.cleanup(() => clearInterval(id))
}

export const timeout = duration => interval(duration).once()

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
