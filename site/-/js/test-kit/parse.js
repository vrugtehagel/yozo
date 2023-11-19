const beakerShape = /^\/\/ test: (.*)$\n((?:^\/\/ .*$\n)+)/mig
const dropShape = /^\/\/ (?!test: )(.*)$\n((?:^(?!\/\/).*$\n)+)/mig
const paramShape = /__\w+__/g
const dropTypes = ['given', 'when', 'then', 'verify', 'finally', 'and']
const AsyncFunction = (async function(){}).constructor

export function parse(essay){
	const dropMatches = [...essay.matchAll(dropShape)]
	const drops = dropMatches.map(match => parseDrop(match))
	const tests = []
	for(const match of essay.matchAll(beakerShape)){
		const name = match[1].trim()
		const lines = match[2].split('\n').slice(0, -1)
		let testing = ''
		let verification = ''
		let previousType
		let needsVerification = false
		for(const raw of lines){
			const line = raw.slice(2).trim()
			const index = line.indexOf(' ')
			if(index == -1) throw Error(`Test step "${raw}" lacks content`)
			const rawType = line.slice(0, index).toLowerCase()
			const content = line.slice(index).trim()
			const typeExists = dropTypes.includes(rawType)
			if(!typeExists) throw Error(`Invalid step type in "${raw}"`)
			if(rawType != 'and') previousType = rawType
			const type = rawType == 'and' ? previousType : rawType
			if(!type) throw Error(`Cannot "and" first statement in "${name}"`)
			if(type == 'when') needsVerification = true
			const code = seek(drops, drop => drop.match(content))
			testing += stringifyStep(raw, code, type, 'test')
			verification += stringifyStep(raw, code, type, 'verify')
		}
		const run = () => new AsyncFunction('assert', testing)(success => {
			if(!success) throw Error(`Test "${name}" failed.`)
		})
		if(!needsVerification) verification = ''
		const verify = () => new AsyncFunction('assert', verification)(success => {
			if(!success) throw Error(`Verification for "${name}" failed.`)
		})
		const code = testing
		const test = {name, code, run, verify}
		tests.push(test)
	}
	return tests
}

function parseDrop([full, identifier, content]){
	const params = identifier.match(paramShape) ?? []
	const source = identifier.replace(paramShape, '(.*)')
	const shape = new RegExp(`^${source}$`, 'i')
	const match = string => {
		const match = string.match(shape)
		if(!match) return null
		const entries = params.map((param, index) => [param, match[index + 1]])
		const map = new Map(entries)
		const code = content.replaceAll(paramShape, param => map.get(param))
		return code.trim()
	}
	return {match}
}

function runner(name, type, code){
	return () => new AsyncFunction('assert', code)(success => {
		if(success) return
		if(type == 'test') throw Error(`Test "${name}" failed.`)
		else throw Error(`Verification for "${name}" failed.`)
	})
}

function stringifyStep(raw, code, type, mode){
	if(type == 'given') return `${raw}\n${code}\n`
	if(type == 'finally') return `${raw}\n${code}\n`
	if(type == 'verify') return `${raw}\nassert(${code});\n`
	if(type == 'when' && mode == 'verify') return ''
	if(type == 'when') return `${raw}\n${code}\n`
	if(mode == 'verify') return `${raw}\nassert(!(${code}));\n`
	return `${raw}\nassert(${code});\n`
}

function seek(array, callback){
	for(const item of array){
		const result = callback(item)
		if(result) return result
	}
	return null
}
