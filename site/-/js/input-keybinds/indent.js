import { $settings } from '/-/js/site-settings/index.js'

export const single = {
	shortcut: 'Tab',
	selection: false,
	run: state => {
		const {indent = '\t'} = $settings
		state.before += indent
		return true
	}
}

export const selection = {
	shortcut: 'Tab',
	selection: true,
	run: state => {
		const {indent = '\t'} = $settings
		const index = state.before.lastIndexOf('\n') + 1
		state.before = state.before.slice(0, index)
			+ indent
			+ state.before.slice(index)
		state.selection = state.selection.replaceAll('\n', '\n' + indent)
		return true
	}
}

export const dedentSelection = {
	shortcut: 'Shift+Tab',
	run: state => {
		const {indent = '\t'} = $settings
		const index = state.before.lastIndexOf('\n') + 1
		if(state.before.startsWith(indent, index))
			state.before = state.before.slice(0, index)
				+ state.before.slice(index + indent.length)
		else if(state.selection.startsWith(indent))
			state.selection = state.selection.slice(indent.length)
		else if(!state.selection && state.after.startsWith(indent))
			state.after = state.after.slice(indent.length)
		state.selection = state.selection.replaceAll(`\n${indent}`, '\n')
		return true
	}
}

export const newline = {
	action: 'insertLineBreak',
	run: state => {
		const currentIndent = state.before
			.slice(state.before.lastIndexOf('\n') + 1)
			.match(/^[ \t]*/)[0]
		state.before += `\n${currentIndent}`
		state.selection = ''
		return true
	}
}

// export const fixPasted = {
// 	action: 'insertFromPaste',
// 	run: (state, {data}) => {}
// }
