export class InputState {
	static from(thing){
		if(thing instanceof this) return thing
		return new InputState(thing)
	}

	beforeSelection
	selection
	afterSelection

	constructor({value, selectionStart, selectionEnd}){
		this.beforeSelection = value.slice(0, selectionStart)
		this.selection = value.slice(selectionStart, selectionEnd)
		this.afterSelection = value.slice(selectionEnd)
	}

	applyTo(element){
		element.value = `${this.beforeSelection}${this.selection}${this.afterSelection}`
		element.selectionStart = this.beforeSelection.length
		element.selectionEnd = this.beforeSelection.length + this.selection.length
	}
}
