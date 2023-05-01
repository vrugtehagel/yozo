import { errors } from './development/index.js' //
import { Thenable } from './thenable.js'
import { track } from './track.js'
import { camelCase } from './convert-case.js'


export const when = (...targets) => {
	const does = (type, options) => {
		let handler
		return new Thenable(trigger => {
			handler = trigger
			if(!targets.every(target => target instanceof EventTarget)) //
				errors.throw('target-not-event-target') //
			targets.forEach(target => target.addEventListener(type, handler, options))
		}).cleanup(() => targets
			.forEach(target => target.removeEventListener(type, handler, options)))
	}

	const observes = (type, options) => {
		let observer
		return new Thenable(trigger => {
			// Check if there is an observer with given name
			const name = camelCase(`-${type}-observer`) //
			if(typeof self[name] != 'function') //
				errors.throw('observer-not-found', {type, name}) //
			observer = new self[camelCase(`-${type}-observer`)](trigger, options)
			targets.forEach(target => observer.observe(target, options))
		}).cleanup(() => observer.disconnect())
	}

	const get = (source, property) => {
		// check if the user didn't accidentally do e.g. when(...).focus()
		const type = property.replace(/s$/, '') //
		if(!source[property] && type != property && 'on' + property in self) //
			errors.warn('shorthand-used-erroneously', {property, type}) //
		return source[property] ?? does.bind(null, property.replace(/s$/, ''))
	}

	return new Proxy({does, observes}, {get})
}