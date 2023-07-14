import { define } from '../define.js'


define.register(6, 'template', (context, [args]) => {
	if(!args){
		const constructor = function(meta){
			meta.root = this
		}
		return {constructor}
	}
	const template = document.createElement('template')
	template.innerHTML = args[1]
	context.template = template.content
	if(args[0].mode){
		const constructor = function(meta){
			meta.root = this.attachShadow(args[0])
			meta.root.append(meta.render(context.template, [`{${define.public}}`, meta]))
		}
		return {constructor} 
	}
	const constructor = function(meta){
		meta.root = meta.render(context.template, [`{${define.public}}`, meta])
	}
	const connectedCallback = function(meta){
		this.replaceChildren(meta.root)
		meta.root = this
	}
	return {constructor, connectedCallback}
})
