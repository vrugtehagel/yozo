import { R, S, compose } from './utils.js'
import { monitor } from './monitor.js'

export const define = definer => {
	const context = {
		x: new Set(['query', '$']),
		__meta: new WeakMap,
		__body: class extends HTMLElement {
			constructor(){
				super()
				context.__meta.set(this, {x: {}})
				monitor.ignore(() => composed.constructor.call(this, context.__meta.get(this)))
			}
		}
	}
	const calls = {}
	definer(Object.fromEntries(define[R]
		.map(([mod, name]) => [name, (...args) => (calls[name] ??= []).push(args)])
	))
	const mixins = define[R].map(([mod, name]) => mod(context, calls[name] ?? []))
	const composed = compose(mixins)
	Object.entries(composed).map(([key, callback]) => {
		return context.__body.prototype[key] ??= function(...args){
			return monitor.ignore(() => callback.call(this, context.__meta.get(this), ...args))
		}
	})
	customElements.define(context.__title, context.__body)
	return customElements.whenDefined(context.__title)
}

define[R] = []
define.register = (priority, name, mod) => {
	define[R].push([mod, name, priority])
	define[R].sort((a, b) => a[2] - b[2])
}

define[S] = []
define.transform = (priority, transform) => {
	define[S].push([transform, priority])
	define[S].sort((a, b) => a[1] - b[1])
}
