import { define } from '../define.js'


// <style>…</style>

define.register(8, 'style', (context, [args]) => {
	if(!args) return {}
	const sheet = new CSSStyleSheet
	// This is async but that's probably okay
	sheet.replace(args[1])
	return {
		connectedCallback: function(meta){
			// If the component has a shadow root, this is easy
			// But if it doesn't, we need to make sure wherever the component
			// connects, the stylesheet is applied.
			// The "root node" is usually then just the document, but it could
			// also be a shadow root of an ancestor.
			// So we just find the root node and throw the sheet in there if
			// it's not already
			const root = meta.root.mode ? meta.root : this.getRootNode()
			const sheets = root.adoptedStyleSheets
			if(sheets.includes(sheet)) return
			root.adoptedStyleSheets = [...sheets, sheet]
		}
	}
})
