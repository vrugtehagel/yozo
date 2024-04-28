import { define } from './define.js'
import { when } from './when.js'
import { camelCase } from './utils.js'


// register() and register.auto()
// register() takes a URL, fetches it as text, parses it as HTML, and
// then uses the define() function to register the component definition

const registered = new Map
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
