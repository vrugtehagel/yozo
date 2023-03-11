import Thennable from './thennable.js'

export default function interval(duration){
	let id
	return new Thennable(trigger => {
		id = setInterval(trigger, duration)
	}).cleanup(() => clearInterval(id))
}
