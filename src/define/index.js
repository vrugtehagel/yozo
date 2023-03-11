import { errors } from '../development/index.js' //
import goodies from './goodies.js'

const registry = []

export default async function define(definer){
	const meta = new WeakMap
	const context = {
		...goodies,
		meta,
		body: class extends HTMLElement {
			constructor(){
				super()
				meta.set(this, {})
				compose('constructor', this)
			}
		}
	}
	const calls = new Map(registry.map(([mod]) => [mod, []]))
	definer(Object.fromEntries(registry.map(([mod, name]) => {
		return [name, (...args) => calls.get(mod).push(args)]
	})))
	const mixins = await Promise.all(
		[...calls].map(([mod, argslist]) => mod(context, argslist))
	)
	const compose = (name, host, ...args) =>
		mixins.forEach(mixin => mixin[name]?.call(host, meta.get(host), ...args))
	for(const mixin of mixins) for(const key of Object.keys(mixin))
		context.body.prototype[key] ??= function(...args){ compose(key, this, ...args) }
	if(!context.title) errors.throw('no-title') //
	customElements.define(context.title, context.body)
}

define.register = (priority, name, mod, newGoodies) => {
	registry.push([mod, name, priority])
	registry.sort((a, b) => a[2] - b[2])
	for(const [key, value] of Object.entries(newGoodies)) goodies[key].push(...value)
}
