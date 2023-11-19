import { error } from './help.js' //
import { R, S, compose } from './utils.js'
import { monitor } from './monitor.js'

export const define = definer => {
	const context = {
		x: new Set,
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
	for(const key of Object.keys(composed))
		context.__body.prototype[key] ??= function(...args){
			monitor.ignore(() => composed[key].call(this, context.__meta.get(this), ...args))
		}
	if(!context.__title) error`define-missing-title` //
	customElements.define(context.__title, context.__body)
	return customElements.whenDefined(context.__title)
}

define[R] = []
define[S] = []

define.register = (priority, name, mod) => {
	define[R].push([mod, name, priority])
	define[R].sort((a, b) => a[2] - b[2])
}

define.transform = (priority, transform) => {
	define[S].push([transform, priority])
	define[S].sort((a, b) => a[1] - b[1])
}
