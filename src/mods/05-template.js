import { define } from '../define.js'


define.register(5, 'template', (context, [args]) => {
	if(!args){
		const constructor = function(meta){
			meta.root = this
		}
		return {constructor}
	}
	const template = document.createElement('template')
	template.innerHTML = args[1]
	context.__template = template.content
	if(args[0].mode){
		const constructor = function(meta){
			meta.root = this.attachShadow(args[0])
			meta.root.append(meta.__render(context.__template, [`{${[...context.x]}}`, meta.x]))
			customElements.upgrade(meta.root)
		}
		return {constructor} 
	}
	const constructor = function(meta){
		meta.root = meta.__render(context.__template, [`{${[...context.x]}}`, meta.x])
		customElements.upgrade(meta.root)
	}
	const connectedCallback = function(meta){
		this.replaceChildren(meta.root)
		meta.root = this
	}
	return {constructor, connectedCallback}
})
