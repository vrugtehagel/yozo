import { compose } from './utils.js'
import { monitor } from './monitor.js'


// define is being called in register()
// The argument and how it works is confusing but I'll try to explain
// For each component definition, we first and foremost need to collect
// all top-level elements and their respective attributes and content.
// We have registered behavior for some types of elements (see src/mods/)
// and so for each of those types, we'll gather their stuff (other types
// won't do anything anyway). So we set up an object, mapping an element
// name to a "collector" function. That way, register() can just do
// define(mapObject => mapObject[elementName](attrs, content))
// So, all that to say; the definer argument is a function that'll receive
// a map of element name -> collector functions.

export const define = definer => {
	const context = {
		// The exposed properties to be used in the component logic
		x: new Set(['query', '$']),
		// A lookup map: component instance -> metadata
		// We basically dump all instance-related things in there
		__meta: new WeakMap,
		__body: class extends HTMLElement {
			constructor(){
				super()
				context.__meta.set(this, {x: {}})
				// You need to monitor.ignore() constructor calls, otherwise you
				// can get really strange behavior when doing
				// document.createElement(…) in monitored contexts
				monitor.ignore(() => composed.constructor.call(this, context.__meta.get(this)))
			}
		}
	}

	// This object will be collecting each use of the registered elements
	const calls = {}

	// Now we create that map mentioned previously and pass it to definer()
	// This will collect all attributes and "innerHTML" content for each
	// top-level element in the component definition
	definer(Object.fromEntries(registrations
		.map(([mod, name]) => [name, (...args) => (calls[name] ??= []).push(args)])
	))
	// Now, we run each mod (defined in src/mods/), passing them the attributes
	// and innerHTML that they were used with in the component definition
	// They all return an object of functions, like {constructor, connectedCallback},
	// and we then compose them into a single object of aggregated functions,
	// to be slapped onto the prototype
	const composed = compose(
		registrations.map(([mod, name]) => mod(context, calls[name] ?? []))
	)
	Object.entries(composed).map(([key, callback]) => {
		// We sneakily avoid overwriting the constructor here with ??=
		return context.__body.prototype[key] ??= function(...args){
			// We need to monitor.ignore() these things to prevent weird
			// side effects from doing regular DOM operations in monitored contexts
			return monitor.ignore(() => callback.call(this, context.__meta.get(this), ...args))
		}
	})

	// Define it, and return a promise resolving when the definition is ready
	customElements.define(context.__title, context.__body)
	return customElements.whenDefined(context.__title)
}

// This is where we register mods, sorting them by their priority argument
const registrations = []
define.register = (priority, name, mod) => {
	registrations.push([mod, name, priority])
	registrations.sort((a, b) => a[2] - b[2])
}
