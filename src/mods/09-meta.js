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
			return track.ignore(() => live.get(context.meta.get(this).$, options.property))
		}
		const set = function(value){
			track.ignore(() => context.meta.get(this).$[options.property] = value)
		}
		if('readonly' in options) Object.defineProperty(context.body.prototype, options.property, {get})
		else Object.defineProperty(context.body.prototype, options.property, {get, set})
	}
	context.body.observedAttributes = attributes.map(args => args[0].attribute)
	const constructor = function(meta){
		meta.$.attributes = {}
		for(const [options] of attributes){
			const name = camelCase(options.attribute)
			meta.$.$attributes[name] = null
			when(meta.$.$attributes[`$${name}`]).change().then(() => {
				const value = live.get(meta.$.$attributes, name)
				if(value == null) this.removeAttribute(options.attribute)
				else this.setAttribute(options.attribute, value)
			})
			if(options.type == 'boolean'){
				live.link(meta.$[`$${options.as ?? name}`], {
					get: () => live.get(meta.$.$attributes, name) != null,
					set: value => meta.$.$attributes[name] = value ? '' : null
				})
			} else if(options.type){
				const type = self[camelCase(`-${options.type}`)]
				if(!type) error`define-attribute-${options.attribute}-type-${type}-does-not-exist` //
				live.link(meta.$[`$${options.as ?? name}`], {
					get: () => type(live.get(meta.$.$attributes, name) ?? options.default ?? ''),
					set: value => meta.$.$attributes[name] = `${value}`
				})
			}
		}
	}
	const attributeChangedCallback = function(meta, name, oldValue, value){
		meta.$.$attributes[camelCase(name)] = value
	}
	return {constructor, attributeChangedCallback}
})
