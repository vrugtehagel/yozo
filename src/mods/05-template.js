import { define } from '../define.js'
import { warn } from '../help.js' //


define.register(5, 'template', (context, [args]) => {
	if(!args){
		return {
			constructor: function(meta){
				meta.root = this
			}
		}
	}
	const template = document.createElement('template')
	template.innerHTML = args[1]
	context.__template = template.content
	if(args[0].mode){
		const {delegatesFocus} = args[0] //
		if(typeof delegatesFocus == 'string' && delegatesFocus != 'true'){ //
			warn`template-invalid-delegates-focus-${delegatesFocus}` //
		} //
		if('delegatesfocus' in args[0]){ //
			warn`template-option-incorrect-case-for-${'delegates-focus'}` //
		} //
		if('slotassignment' in args[0]){ //
			warn`template-option-incorrect-case-for-${'slot-assignment'}` //
		} //
		return {
			constructor: function(meta){
				meta.root = this.attachShadow(args[0])
				meta.root.append(meta.__render(
					context.__template,
					[[`{${[...context.x]}}`, meta.x]],
					meta.x.connected
				))
				customElements.upgrade(meta.root)
			}
		}
	}
	return {
		constructor: function(meta){
			meta.root = meta.__render(
				context.__template,
				[[`{${[...context.x]}}`, meta.x]],
				meta.x.connected
			)
			customElements.upgrade(meta.root)
		},
		connectedCallback: function(meta){
			if(meta.root == this) return
			this.replaceChildren(meta.root)
			meta.root = this
		}
	}
})
