export const svgManager = new class SVGManager {
	#items = new Map

	async #get(src){
		const {origin} = location
		const url = new URL(src, `${origin}/-/svg/`)
		if(!url.pathname.startsWith('/-/svg/')) return
		const key = url.pathname.slice(7)
		if(this.#items.has(key)) return this.#items.get(key)
		const response = await fetch(url)
		if(!response.ok) return ''
		const text = await response.text()
		const template = document.createElement('template')
		template.innerHTML = text
		this.#items.set(key, template)
		return template
	}

	async get(src){
		const template = await this.#get(src).catch(() => null)
		if(!template) return null
		return template.content.cloneNode(true)
	}

}
