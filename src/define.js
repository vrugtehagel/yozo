import { error } from './help.js' //
import { R, S } from './utils.js'
import { track } from './track.js'

export const define = definer => {
	const meta = new WeakMap
	const body = class extends HTMLElement {
		constructor(){
			super()
			meta.set(this, {})
			compose('constructor', this)
		}
	}
	const context = {meta, body}
	const calls = new Map(define[R].map(([mod, name]) => [name, []]))
	definer(Object.fromEntries(define[R].map(([mod, name]) => {
		return [name, (...args) => calls.get(name).push(args)]
	})))
	const mixins = define[R]
		.map(([mod, name]) => mod(context, calls.get(name)))
	const compose = (name, host, ...args) => {
		track.ignore(() =>
			mixins.forEach(mixin => mixin[name]?.call(host, meta.get(host), ...args))
		)
	}
	for(const mixin of mixins) for(const key of Object.keys(mixin))
		body.prototype[key] ??= function(...args){ compose(key, this, ...args) }
	if(!context.title) error`define-missing-title` //
	customElements.define(context.title, body)
	return customElements.whenDefined(context.title)
}

define[R] = []
define[S] = []

define.public = ['$', 'elements', 'connect', 'disconnect']

define.register = (priority, name, mod) => {
	define[R].push([mod, name, priority])
	define[R].sort((a, b) => a[2] - b[2])
}


define.transform = (priority, transform) => {
	define[S].push([transform, null, priority])
	define[S].sort((a, b) => a[1] - b[1])
}
