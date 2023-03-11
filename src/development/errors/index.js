import messages from './messages.js'

export default new class Errors {
	throw(name, data = {}){
		const {type} = messages[name]
		const message = this.#getMessage(name, data)
		throw type(message)
	}

	warn(name, data = {}){
		const message = this.#getMessage(name, data)
		console.warn(message)
	}

	#getMessage(name, data){
		if(!(name in messages)) this.throw('never')
		const definition = messages[name]
		const applyData = text =>
			text.replaceAll(/{(\w+)}/g, (match, name) => data[name])
		const message = applyData(definition.message)
		const help = definition.help ? '\n' + applyData(definition.help) : ''
		return message + help
	}

}
