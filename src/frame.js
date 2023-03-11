import Thennable from './thennable.js'
import track from './track.js'

export default function frame(){
	let id
	return new Thennable(trigger => {
		const next = () =>
			id = requestAnimationFrame(time => next(trigger(time)))
		next()
	}).cleanup(() => cancelAnimationFrame(id))
}
