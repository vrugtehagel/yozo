import { define } from '../define.js'


// <style>…</style>

define.register(8, 'style', (context, [args]) => {
	if(!args) return {}
	const sheet = new CSSStyleSheet
	// This should be synchronous, since otherwise styles may not have loaded
	// yet when the component is being rendered. This can be bad both because
	// JS could be trying to read the styles, but also because transitions
	// might run from UA styles to the initial styles defined in the sheet.
	sheet.replaceSync(args[1])
	return {
		constructor: function(meta){
			// We don't use the `connectedCallback` directly here, because we
			// want the stylesheet to be inserted before user-defined
			// `connected()` callbacks run. These are collected and run in the
			// `connectedCallback` from the hooks, so if we use `connected()`
			// here they will run _before_ `<script>`-defined callbacks,
			// whereas using `connectedCallback()` will cause them to run
			// after.
			meta.x.connected(() => {
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
			})
		}
	}
})
