export class Snippet {
	static #all = []
	static #constructing = false
	static #shape = /^\/\/ (.*)$\n((?:^(?!\/\/ ).*$\n)*)/m
	static #paramShape = /__\w+__/g
	#regex
	#params = []
	#description = ''
	#code = ''

	static from(source){
		const match = source.match(this.#shape)
		if(!match) return null
		const [full, description, code] = match
		this.#constructing = true
		const snippet = new Snippet(description.trim(), code.trim())
		this.#constructing = false
		this.#all.push(snippet)
		return snippet
	}

	static find(input){
		for(const snippet of this.#all){
			const code = snippet.#match(input)
			if(code) return {snippet, code}
		}
		throw Error(`No snippet matches "${input}"`)
	}

	constructor(description, code){
		if(!Snippet.#constructing) throw TypeError('Illegal constructor')
		this.#description = description
		this.#code = code
		this.#params = description.match(Snippet.#paramShape) ?? []
		const regexSource = description.replaceAll(Snippet.#paramShape, '(.*)')
		this.#regex = new RegExp(`^${regexSource}$`, 'i')
	}

	#match(input){
		const match = input.match(this.#regex)
		if(!match) return null
		const params = match.slice(1)
		const entries = this.#params
			.map((param, index) => [param, params[index]])
		const mapping = new Map(entries)
		const code = this.#code
			.replaceAll(Snippet.#paramShape, param => mapping.get(param))
		return code
	}

}
