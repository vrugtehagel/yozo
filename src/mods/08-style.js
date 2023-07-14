import { define } from '../define.js'

define.register(8, 'style', (context, [args]) => {
	if(!args) return {}
	try {
		const sheet = new CSSStyleSheet
		sheet.replace(args[1])
		const connectedCallback = function(meta){
			const root = meta.elements.shadow ?? this.getRootNode()
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
})
