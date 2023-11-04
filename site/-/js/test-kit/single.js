import { Snippet } from './snippet.js'


export class Test {
	static #constructing = false
	#name = ''
	#steps = []
	#run = null
	#verify = null
	#code = ''
	get name(){ return this.#name }
	get code(){ return this.#code }
	get run(){ return this.#run }
	get verify(){ return this.#verify }

	static from(source){
		if(source.slice(0, 9).toLowerCase() != '// test: ') return null
		const lines = source.slice(9).split('\n//').map(text => text.trim())
		const name = lines.shift()
		let previousType
		const steps = lines.map(line => {
			const raw = `// ${line}`
			const index = line.indexOf(' ')
			if(index == -1) throw Error(`Test step "${line}" lacks content`)
			const rawType = line.slice(0, index).toLowerCase()
			const content = line.slice(index).trim()
			if(!['and', 'given', 'when', 'then', 'verify'].includes(rawType))
				throw Error(`Cannot process step "${rawType}..." in "${name}"`)
			if(rawType != 'and') previousType = rawType
			const type = rawType == 'and' ? previousType : rawType
			if(!type) throw Error(`Cannot chain first statement in "${name}"`)
			return {raw, type, content}
		})
		this.#constructing = true
		const test = new Test(name.trim(), steps)
		this.#constructing = false
		return test
	}

	static #assert(success, type, name){
		if(typeof success != 'boolean')
			console.warn(`Test "${name}" does not assert a boolean`)
		if(success) return
		if(type == 'test') throw Error(`Test "${name}" failed.`)
		else throw Error(`Verification for "${name}" failed.`)
	}

	constructor(name, steps){
		if(!Test.#constructing) throw TypeError('Illegal constructor')
		this.#name = name
		this.#steps = steps
	}

	compile(){
		for(const step of this.#steps)
			Object.assign(step, Snippet.find(step.content))
		const main = this.#steps.map(step => {
			if(step.type == 'then' || step.type == 'verify')
				return `${step.raw}\nassert(${step.code});\n`
			return `${step.raw}\n${step.code}\n`
		}).join('')
		const verification = this.#steps.map(step => {
			if(step.type == 'then')
				return `${step.raw}\nassert(!(${step.code}));\n`
			if(step.type == 'verify')
				return `${step.raw}\nassert(${step.code});\n`
			if(step.type == 'when') return ''
			return `${step.raw}\n${step.code}\n`
		}).join('')
		this.#code = main
		const AsyncFunction = (async function(){}).constructor
		this.#run = () => new AsyncFunction('assert', main)(success => {
			return Test.#assert(success, 'test', this.#name)
		})
		if(this.#steps.every(step => step.type != 'when'))
			return this.#verify = () => Promise.resolve()
		this.#verify = () => new AsyncFunction('assert', verification)(success => {
			return Test.#assert(success, 'verify', this.#name)
		})
	}
}
