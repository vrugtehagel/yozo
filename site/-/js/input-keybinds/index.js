import * as history from './history.js'
import * as delimiters from './delimiters.js'
import * as indent from './indent.js'
import * as miscellaneous from './miscellaneous.js'
const {when} = self.yozo


const configuration = {}
configuration.default = [
	...Object.values(history),
	...Object.values(delimiters),
	...Object.values(indent),
	...Object.values(miscellaneous),
]

function getState(input){
	const {value, selectionStart, selectionEnd} = input
	const before = value.slice(0, selectionStart)
	const selection = value.slice(selectionStart, selectionEnd)
	const after = value.slice(selectionEnd)
	return {before, selection, after}
}

function putState(input, state){
	const {before, selection, after} = state
	input.value = before + selection + after
	input.selectionStart = before.length
	input.selectionEnd = before.length + selection.length
}

export function attach(input, language){
	const keybinds = configuration[language] ?? configuration.default
	const inputKeybinds = keybinds.filter(keybind => keybind.action)
	let state
	when(input).beforeinputs().then(() => state = getState(input))
	when(input).inputs().then(event => {
		if(event instanceof CustomEvent) return
		if(!state) return
		for(const keybind of inputKeybinds){
			if(state.selection && keybind.selection == false) continue
			if(!state.selection && keybind.selection) continue
			if(![event.inputType, '*'].includes(keybind.action)) continue
			const changed = keybind.run(state, event)
			if(!changed) continue
			putState(input, state)
			input.dispatchEvent(new CustomEvent('input'))
			break
		}
		state = null
	})

	const keydownKeybinds = keybinds.filter(keybind => keybind.shortcut)
	when(input).keydowns().then(event => {
		state = getState(input)
		for(const keybind of keydownKeybinds){
			if(state.selection && keybind.selection == false) continue
			if(!state.selection && keybind.selection) continue
			const modifiers = keybind.shortcut.toLowerCase().split('+')
			const key = modifiers.pop()
			if(key != event.key.toLowerCase()) continue
			if(modifiers.includes('shift') != event.shiftKey) continue
			if(modifiers.includes('ctrl') != (event.metaKey || event.ctrlKey))
				continue
			event.preventDefault()
			const changed = keybind.run(state, event)
			if(!changed) continue
			putState(input, state)
			input.dispatchEvent(new CustomEvent('input'))
			break
		}
		state = null
	})
}
