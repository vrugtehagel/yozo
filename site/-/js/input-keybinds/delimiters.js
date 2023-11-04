const map = new Map('(){}[]\'\'""``'.match(/../g).map(pair => [...pair]))
const lefties = new Set([...map.keys()])
const righties = new Set([...map.values()])

export const ignoreNextClosing = {
	action: 'insertText',
	selection: false,
	run: (state, {data}) => {
		if(!righties.has(data)) return
		if(state.after[0] != data) return
		state.before += data
		state.after = state.after.slice(1)
		return true
	}
}

export const insertMatching = {
	action: 'insertText',
	run: (state, {data}) => {
		if(!lefties.has(data)) return
		const [left, right] = [data, map.get(data)]
		state.before += left
		state.after = right + state.after
		return true
	}
}

export const removePair = {
	action: 'deleteContentBackward',
	selection: false,
	run: state => {
		const deleted = state.before.at(-1)
		if(!lefties.has(deleted)) return
		if(state.after[0] != map.get(deleted)) return
		state.before = state.before.slice(0, -1)
		state.after = state.after.slice(1)
		return true
	}
}

// export const autoIndentNewline = {
// 	action: 'insertText',
// 	selection: false,
// 	run: state => {}
// }

// export const autoDedent = {
// 	action: 'insertText',
// 	selection: false,
// 	run: state => {}
// }
