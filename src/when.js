import { error, warn } from './help.js' //
import { Flow } from './flow.js'
import { camelCase } from './utils.js'

export const when = (...targets) => new Proxy({
	does: (type, options) => {
		let handler
		return new Flow(trigger => {
			handler = trigger
			if(!targets.every(target => typeof target?.addEventListener == 'function')) //
				error`when-arg-not-event-target` //
			targets.map(target => target.addEventListener(type, handler, options))
		}).cleanup(() => targets
			.map(target => target.removeEventListener(type, handler, options)))
	},
	observes: (type, options) => {
		let observer
		return new Flow(trigger => {
			const name = camelCase(`-${type}-observer`) //
			if(typeof self[name] != 'function') //
				error`when-cannot-observe-${type}-no-${name}` //
			observer = new self[camelCase(`-${type}-observer`)](trigger, options)
			targets.map(target => observer.observe(target, options))
		}).cleanup(() => observer.disconnect())
	}
}, {get: (source, property) => {
	const type = property.replace(/s$/, '') //
	if(!source[property] && type != property && 'on' + property in self) //
		warn`when-${property}-instead-of-${type}-mistake` //
	return source[property] ?? source.does.bind(null, property.replace(/s$/, ''))
}})
