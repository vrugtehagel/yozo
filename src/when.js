import { errors } from './development/index.js' //
import Thennable from './thennable.js'
import track from './track.js'
import camelCase from './camel-case.js'


export default function when(...targets){
	const does = (type, options) => {
		let handler
		return new Thennable(trigger => {
			handler = trigger
			if(!targets.every(target => target instanceof EventTarget)) //
				errors.throw('target-not-event-target') //
			targets.forEach(target => target.addEventListener(type, handler, options))
		}).cleanup(() => targets
			.forEach(target => target.removeEventListener(type, handler, options)))
	}

	const observes = (type, options) => {
		let observer
		return new Thennable(trigger => {
			// Check if there is an observer with given name
			const name = camelCase(`-${type}-observer`) //
			if(typeof self[name] != 'function') //
				errors.throw('observer-not-found', {type, name}) //
			observer = new self[camelCase(`-${type}-observer`)](trigger, options)
			targets.forEach(target => observer.observe(target, options))
		}).cleanup(() => observer.disconnect())
	}

	const get = (source, property) => source[property]
		?? does.bind(null, property.replace(/s$/, ''))

	return new Proxy({does, observes}, {get})
}
