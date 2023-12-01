import { define } from '../define.js'

define.register(8, 'style', (context, [args]) => {
	if(!args) return {}
	const sheet = new CSSStyleSheet
	sheet.replace(args[1])
	return {connectedCallback: function(meta){
		const root = meta.x.elements.shadow ?? this.getRootNode()
		const sheets = root.adoptedStyleSheets
		if(sheets.includes(sheet)) return
		root.adoptedStyleSheets = [...sheets, sheet]
	}}
})
