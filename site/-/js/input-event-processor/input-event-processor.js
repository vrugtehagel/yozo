import { InputState } from './input-state.js'

export class InputEventProcessor {
	static presets = {}

	#registrations = []
	#state = null

	register(registration){
		this.#registrations.push(registration)
	}

	saveState(element){
		this.#state = InputState.from(element)
	}

	process(event){
		const stateChanged = this.#registrations
			.some(registration => registration(event, this.#state))
		if(stateChanged) this.#state.applyTo(event.target)
		this.#state = null
	}
}
