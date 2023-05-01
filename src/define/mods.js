import { html } from '../html.js'
import { camelCase, kebabCase } from '../convert-case.js'
import { Thenable } from '../thenable.js'
import { track } from '../track.js'
import { watch } from '../watch/index.js'
import { when } from '../when.js'

import { define } from './index.js'

define.register(0, 'title', (context, [args]) => {
	context.title = args[1]
	return {}
}, {})

define.register(1, null, context => {
	const constructor = function(meta){
		meta.exposed = {$: watch({}), host: this}
		meta.hooks = {}
	}
	const connectedCallback = function(meta){
		meta.connected = true
	}
	const disconnectedCallback = function(meta){
		meta.connected = false
	}
	return {constructor, connectedCallback, disconnectedCallback}
}, {exposed: ['$', 'host']})

define.register(2, 'template', async (context, [args]) => {
	if(!args){
		const constructor = function(meta){
			meta.root = this
		}
		return {constructor}
	}
	context.template = html`${args[1]}`
	await Promise.all([...context.template.querySelectorAll(':not(:defined)')]
		.map(element => customElements.whenDefined(element.localName)))
	if(args[0].mode){
		const constructor = function(meta){
			meta.root = this.attachShadow(args[0])
			meta.root.append(context.template.cloneNode(true))
		}
		return {constructor} 
	}
	const constructor = function(meta){
		meta.root = context.template.cloneNode(true)
	}
	const connectedCallback = function(meta){
		this.replaceChildren(meta.root)
		meta.root = this
	}
	return {constructor, connectedCallback}
}, {})

define.register(4, null, context => {
	const constructor = function(meta){
		const cache = {all: selector => [...meta.root.querySelectorAll(selector)]}
		if(meta.root.mode) cache.shadow = meta.root
		const get = (find, name) => {
			if(cache[name]) return cache[name]
			const kebabName = kebabCase(name)
			return cache[name] = find(`#${kebabName},#${name}`) ?? find(kebabName)
		}
		meta.exposed.elements = new Proxy(selector => meta.root.querySelector(selector), {get})
	}
	return {constructor}
}, {exposed: ['elements']})

define.register(5, null, context => {
	const callbacks = Symbol()
	const constructor = function(meta){
		meta[callbacks] = []
		meta.hooks.disconnect = callback => { meta[callbacks].push(callback) }
	}
	const disconnectedCallback = function(meta){
		meta[callbacks].forEach(callback => callback())
	}
	return {constructor, disconnectedCallback}
}, {hooks: ['disconnect']})

define.register(6, null, context => {
	const callbacks = Symbol()
	const calls = Symbol()
	const constructor = function(meta){
		meta[callbacks] = []
		meta.hooks.connect = callback => { meta[callbacks].push(callback) }
	}
	const connectedCallback = function(meta){
		meta[calls] = meta[callbacks].map(callback => track.undo(callback))
	}
	const disconnectedCallback = function(meta){
		meta[calls].forEach(call => call.undo())
		meta[calls] = null
	}
	return {constructor, connectedCallback, disconnectedCallback}
}, {hooks: ['connect']})

define.register(7, null, context => {
	const queue = Symbol()
	const constructor = function(meta){
		meta[queue] = new Set
		meta.hooks.effect = callback => {
			let watcher
			let call
			const thenable = new Thenable().cleanup(() => watcher.die())
			const run = async (event) => {
				await 1
				if(meta.connected) update()
				else meta[queue].add(update)
			}
			const update = () => {
				call?.undo()
				call = track(['undo', 'watched'], callback)
				watcher = track.ignore(() => when(call.watched).change()).once().then(run)
				thenable.now()
			}
			run()
			return thenable
		}
	}
	const connectedCallback = function(meta){
		meta[queue].forEach(update => update())
		meta[queue].clear()
	}
	return {constructor, connectedCallback}
}, {hooks: ['effect']})

define.register(8, 'style', (context, [args]) => {
	if(!args) return {}
	try {
		const sheet = new CSSStyleSheet
		sheet.replace(args[1])
		const connectedCallback = function(meta){
			const root = meta.exposed.elements.shadow ?? this.getRootNode()
			const sheets = root.adoptedStyleSheets
			if(sheets.includes(sheet)) return
			root.adoptedStyleSheets = [...sheets, sheet]
		}
		return {connectedCallback}
	} catch {
		const style = document.createElement('style')
		style.textContent = args[1]
		let stylesAdded = false
		const constructor = function(meta){
			if(meta.root.mode){
				meta.exposed.elements.shadow.append(style.cloneNode(true))
			} else {
				if(stylesAdded) return
				stylesAdded = true
				document.head.append(style)
			}
		}
		return {constructor}
	}
}, {})

define.register(9, 'meta', (context, argslist) => {
	const attributes = argslist.filter(args => args[0].attribute)
	const properties = [
		...argslist.filter(args => args[0].property),
		...attributes.filter(args => args[0].type).map(args => [{property: args[0].as ?? camelCase(args[0].attribute)}]),
		...argslist.filter(args => args[0].method).map(args => [{property: args[0].method, readonly: ''}])
	]
	for(const [options] of properties){
		const get = function(){
			return track.ignore(() => context.meta.get(this).exposed.$[`$${options.property}`].get())
		}
		const set = function(value){
			track.ignore(() => context.meta.get(this).exposed.$[`$${options.property}`].set(value))			
		}
		if('readonly' in options) Object.defineProperty(context.body.prototype, options.property, {get})
		else Object.defineProperty(context.body.prototype, options.property, {get, set})
	}
	context.body.observedAttributes = attributes.map(args => args[0].attribute)
	const constructor = function(meta){
		meta.exposed.$.$attributes = {}
		for(const [options] of attributes){
			const name = camelCase(options.attribute)
			meta.exposed.$.$attributes[`$${name}`].set(null)
			when(meta.exposed.$.$attributes[`$${name}`]).change().then(() => {
				const value = meta.exposed.$.$attributes[`$${name}`].get()
				if(value == null) this.removeAttribute(options.attribute)
				else this.setAttribute(options.attribute, value)
			})
			if(options.type == Boolean){
				meta.exposed.$[`$${options.as ?? name}`].bind({
					get: () => meta.exposed.$.$attributes[`$${name}`].get() != null,
					set: value => meta.exposed.$.$attributes[`$${name}`].set(value ? '' : null)
				})
			} else if(options.type){
				meta.exposed.$[`$${options.as ?? name}`].bind({
					get: () => options.type(meta.exposed.$.$attributes[`$${name}`].get() ?? options.default ?? ''),
					set: value => meta.exposed.$.$attributes[`$${name}`].set(`${value}`)
				})				
			}
		}
	}
	const attributeChangedCallback = function(meta, name, oldValue, value){
		meta.exposed.$.$attributes[`$${camelCase(name)}`].set(value)
	}
	return {constructor, attributeChangedCallback}
}, {})

define.register(10, null, context => {
	const regex = /{{([^]*?)}}/
	const constructor = function(meta){
		if(meta.root == this) return
		const iterator = document.createNodeIterator(meta.root, 5)
		let current
		while(current = iterator.nextNode()){
			if(current.nodeType == 1){
				const node = current
				for(const attribute of [...node.attributes]){
					if(attribute.name[0] == '.'){
						const chain = attribute.name.split('.').slice(1).map(camelCase)
						node.removeAttribute(attribute.name)
						const getter = new Function(`{${context.exposed}}`, `return (${attribute.value})`)
						meta.hooks.effect(() => {
							let current = node
							const properties = [...chain]
							const last = properties.pop()
							for(const property of properties) current = current[property]
							current[last] = getter(meta.exposed)
						})
					} else if(attribute.name[0] == '@') {
						const type = camelCase(attribute.name.slice(1))
						node.removeAttribute(attribute.name)
						const handler = new Function('event', `{${context.exposed}}`, attribute.value)
						meta.hooks.connect(() => {
							when(node).does(type).then(event => handler.call(node, event, meta.exposed))
						})
					}
				}
			} else {
				let match
				let node = current
				while(match = node.textContent.match(regex)){
					const dynamic = node.splitText(match.index)
					dynamic.splitText(match[0].length)
					iterator.nextNode()
					node = iterator.nextNode()
					const getter = new Function(`{${context.exposed}}`, `return (${match[1]})`)
					meta.hooks.effect(() => dynamic.textContent = getter(meta.exposed))
				}
			}
		}
	}
	return {constructor}
}, {})

define.register(11, 'script', (context, [args]) => {
	const constructor = function(meta){
		args[1].call(this, meta.exposed, meta.hooks)
	}
	return {constructor}
}, {})
