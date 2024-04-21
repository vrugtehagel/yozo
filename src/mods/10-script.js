import { define } from '../define.js'


// <script>…</script>

define.register(10, 'script', (context, [args]) => {
	if(!args) return {}
	// Parse the component body into a function of the "exposed properties"
	// which are registered in context.x (and looked up in meta.x)
	// Also we make the yozo helpers available.
	const callback = new Function(`{${[...context.x]}}`,
		`const{${Object.keys(self.yozo)}}=self.yozo;` +
		`\n\n\n// The <${context.__title}> component: the <script> section\n` + //
		`${args[1]}`
	)
	return {
		constructor: function(meta){
			// Allows us to do use "this" and point it at the component
			callback.call(this, meta.x)
		}
	}
})
