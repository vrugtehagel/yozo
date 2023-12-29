import { error } from '../help.js' //
import { define } from '../define.js'
import { camelCase } from '../utils.js'
import { monitor } from '../monitor.js'
import { live } from '../live.js'
import { when } from '../when.js'


// Attributes, properties, methods, form-associated (hooks are separate)

define.register(1, 'meta', (context, argslist) => {
	// First, sort the meta tags into the correct buckets
	const attributes = argslist.filter(args => args[0].attribute)

	// Attributes with a "type" attribute have a property
	// Methods are just readonly properties
	const properties = [
		...argslist.filter(args => args[0].property),
		...attributes.filter(args => args[0].type).map(args => [{property: args[0].as ?? camelCase(args[0].attribute)}]),
		...argslist.filter(args => args[0].method).map(args => [{property: args[0].method, readonly: true}])
	]

	// Define the properties on the prototype
	properties.map(([options]) => {
		const get = function(){
			// Ignore the monitored context so custom element properties can't
			// participate in them.
			// If they could, then subtle implementation changes in one component
			// could break a whole bunch of other stuff - not good!
			return monitor.ignore(() => live.get(context.__meta.get(this).x.$, options.property))
		}
		Object.defineProperty(context.__body.prototype, options.property, 'readonly' in options
			? {get}
			: {get, set: function(value){ context.__meta.get(this).x.$[options.property] = value }}
		)
	})

	// Static properties
	context.__body.observedAttributes = attributes.map(args => args[0].attribute)
	context.__body.formAssociated = argslist.some(args => args[0].formAssociated != null)

	const constructor = function(meta){
		// We set up $, the component state object
		meta.x.$ = live({attributes: {}})

		// Now we link $.$attributes[name]
		attributes.map(([options]) => {
			const name = camelCase(options.attribute)

			// First we link it to the real attribute
			// We can't use live.link() here because the change callback is
			// the attributeChangedCallback lifecycle callback
			meta.x.$.$attributes[name] = null
			when(meta.x.$.$attributes[`$${name}`]).change().then(() => {
				const value = live.get(meta.x.$.$attributes, name)
				if(value == null) this.removeAttribute(options.attribute)
				else this.setAttribute(options.attribute, value)
			})

			// Then we also link it to the property types
			if(options.type == 'boolean'){
				live.link(meta.x.$[`$${options.as ?? name}`], {
					get: () => live.get(meta.x.$.$attributes, name) != null,
					set: value => meta.x.$.$attributes[name] = value ? '' : null,
					changes: when(meta.x.$.$attributes[`$${name}`]).change()
				})
			} else if(options.type){
				// We're doing a little trick here converting the type string
				// to PascalCase and then looking it up on the window object
				// For example, big-int -> BigInt -> window.BigInt()
				// That way we don't need to manually handle each case
				const type = self[camelCase(`-${options.type}`)]
				if(options.type == 'bigint') //
					warn`define-attribute-${options.attribute}-is-type-bigint-instead-of-big-int` //
				else if(!['boolean', 'string', 'number', 'big-int'].includes(options.type)) //
					warn`define-attribute-${options.attribute}-type-${options.type}-unknown` //
				else if(!type) //
					error`define-attribute-${options.attribute}-type-${options.type}-does-not-exist` //
				live.link(meta.x.$[`$${options.as ?? name}`], {
					get: () => type(live.get(meta.x.$.$attributes, name) ?? options.default ?? ''),
					set: value => meta.x.$.$attributes[name] = value == null ? null : `${value}`,
					changes: when(meta.x.$.$attributes[`$${name}`]).change()
				})
			}
		})

		// If a component has own properties before it was defined, but we
		// also defined the same property on the prototype, then we need to
		// take off the own property and reassign it (so it uses the
		// getter/setter on the prototype instead)
		properties.map(([{property}]) => {
			if(!Object.hasOwn(this, property)) return
			const oldValue = this[property]
			delete this[property]
			this[property] = oldValue
		})
	}
	const attributeChangedCallback = function(meta, name, oldValue, value){
		meta.x.$.$attributes[camelCase(name)] = value
	}
	return {constructor, attributeChangedCallback}
})
