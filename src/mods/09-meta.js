import { define } from '../define.js'
import { camelCase } from '../utils.js'
import { track } from '../track.js'
import { live } from '../live.js'
import { when } from '../when.js'


define.register(9, 'meta', (context, argslist) => {
	const attributes = argslist.filter(args => args[0].attribute)
	const properties = [
		...argslist.filter(args => args[0].property),
		...attributes.filter(args => args[0].type).map(args => [{property: args[0].as ?? camelCase(args[0].attribute)}]),
		...argslist.filter(args => args[0].method).map(args => [{property: args[0].method, readonly: ''}])
	]
	for(const [options] of properties){
		const get = function(){
			return track.ignore(() => live.get(context.__meta.get(this).x.$, options.property))
		}
		const set = function(value){
			track.ignore(() => context.__meta.get(this).x.$[options.property] = value)
		}
		if('readonly' in options) Object.defineProperty(context.__body.prototype, options.property, {get})
		else Object.defineProperty(context.__body.prototype, options.property, {get, set})
	}
	context.__body.observedAttributes = attributes.map(args => args[0].attribute)
	context.__body.formAssociated = argslist.some(args => args[0].formAssociated != null)
	const constructor = function(meta){
		meta.x.$.attributes = {}
		for(const [options] of attributes){
			const name = camelCase(options.attribute)
			meta.x.$.$attributes[name] = null
			when(meta.x.$.$attributes[`$${name}`]).change().then(() => {
				const value = live.get(meta.x.$.$attributes, name)
				if(value == null) this.removeAttribute(options.attribute)
				else this.setAttribute(options.attribute, value)
			})
			if(options.type == 'boolean'){
				live.link(meta.x.$[`$${options.as ?? name}`], {
					get: () => live.get(meta.x.$.$attributes, name) != null,
					set: value => meta.x.$.$attributes[name] = value ? '' : null
				})
			} else if(options.type){
				const type = self[camelCase(`-${options.type}`)]
				if(!type) error`define-attribute-${options.attribute}-type-${type}-does-not-exist` //
				live.link(meta.x.$[`$${options.as ?? name}`], {
					get: () => type(live.get(meta.x.$.$attributes, name) ?? options.default ?? ''),
					set: value => meta.x.$.$attributes[name] = value == null ? null : `${value}`
				})
			}
		}
	}
	const attributeChangedCallback = function(meta, name, oldValue, value){
		meta.x.$.$attributes[camelCase(name)] = value
	}
	return {constructor, attributeChangedCallback}
})
