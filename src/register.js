import { define } from './define.js'
import { camelCase } from './utils.js'


const registered = new Map
/**
 * Register a component from a URL to a component definition.
 * {@link https://yozo.ooo/docs/register/}
 */
export const register = url => {
	// Prevent re-registration of the same URL, regardless of whether
	// the registration succeeded or not
	if(!registered.get(`${url}`)){
		registered.set(`${url}`, fetch(url).then(async response => {
			if(!response.ok) return
			const template = document.createElement('template')
			template.innerHTML = await response.text()
			return define(add => {
				for(const element of template.content.children){
					add[element.localName]?.(
						Object.fromEntries([...element.attributes].map(attribute =>
							[camelCase(attribute.name), attribute.value])),
						element.innerHTML
					)
				}
			})
		}))
	}
	return registered.get(`${url}`)
}

// We only allow for calling register.auto() once, and it cannot be undone.
// This is mostly just for simplicity but also to prevent other parties from
// meddling with a setup. Library authors should register() directly.
const autoRegistered = new Set
let find

/**
 * Automatically discover and register new elements.
 * {@link https://yozo.ooo/docs/register/auto/}
 */
register.auto = finder => {
	if(find) return
	find = finder

	// Takes a "root" element and finds the elements in the tree to define
	const from = root => {
		for(const element of root.querySelectorAll(':not(:defined)'))
			autoDefine(element.localName)
		// Can't query inside <template> elements so need to take them
		// as separate roots.
		for(const template of root.querySelectorAll('template'))
			from(template.content)
	}

	// Take a name, find the URL and run the registration
	const autoDefine = name => {
		if(autoRegistered.has(name)) return
		autoRegistered.add(name)
		const url = find(name)
		if(!url) return
		register(url)
	}

	// We sneakily define another mod here, to define custom elements in the
	// template
	define.register(5, Symbol(), context => {
		if(context.__template) from(context.__template)
		return {}
	})

	// Also register elements from the document, though we don't know whether
	// the DOM is ready yet. So, we check the readyState to see what to do.
	if(document.readyState == 'loading'){
		document.addEventListener('readystatechange', () => {
			return from(document)
		}, {once: true})
	} else {
		from(document)
	}
}

register.style = url => {
	const sheet = new CSSStyleSheet
	define.register(6, Symbol(), context => {
		return {
			connectedCallback: function(meta){
				const root = meta.root.mode ? meta.root : this.getRootNode()
				const sheets = root.adoptedStyleSheets
				if(sheets.includes(sheet)) return
				root.adoptedStyleSheets = [...sheets, sheet]
			}
		}
	})
	return fetch(url)
		.then(response => response.text())
		.then(styles => sheet.replace(styles))
}
