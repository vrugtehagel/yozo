import { define } from './define.js'
import { when } from './when.js'
import { camelCase, R } from './utils.js'


// register() and register.auto()
// register() takes a URL, fetches it as text, parses it as HTML, and
// then uses the define() function to register the component definition

export const register = async url => {
	// Prevent re-registration of the same URL, regardless of whether
	// the registration succeeded or not
	if(register[R].has(`${url}`)) return
	register[R].add(`${url}`)
	const response = await fetch(url)
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
}
register[R] = new Set

// We only allow for calling register.auto() once.
// This is because it also needs to dig into component templates
// For light use, this is okay, but for more complex apps, people should
// just use register() explicitly for the elements they define
// because it is faster (load all similtaneously versus loading one,
// then discovering elements in their template, loading those, discovering more,
// etcetera).
let cancelled
register.auto = find => {
	// Keep track of which component names we have tried to register
	if(register.auto[R]) return
	register.auto[R] = new Set

	// Take a name, find the URL and run the registration
	const autoDefine = name => {
		if(register.auto[R].has(name)) return
		register.auto[R].add(name)
		const url = find(name)
		if(!url) return
		register(url)
	}

	// Takes a "root" element and finds the elements in the tree to define
	const from = root => {
		for(const element of root.querySelectorAll(':not(:defined)'))
			autoDefine(element.localName)
		// Can't query inside <template> elements so need to take them
		// as separate roots.
		for(const template of root.querySelectorAll('template'))
			from(template.content)
	}

	// We sneakily define another mod here, to define custom elements in the
	// template
	define.register(6, Symbol(), context => {
		if(cancelled) return {}
		if(context.__template) from(context.__template)
		return {}
	}, {})

	// Keep an eye on the document for new elements, defining new elements
	// as they roll in
	// You can stop this flow and it stops the whole register.auto() thing
	return when(document).observes('mutation', {childList: true, subtree: true})
		.then(() => from(document))
		.now()
		.if(() => null)
		.cleanup(() => cancelled = true)
}
