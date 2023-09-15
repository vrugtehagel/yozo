const entries = []
let cursor = 0

export const save = {
	action: '*',
	run: (state, {data, inputType}) => {
		const active = entries[cursor]
		const timestamp = Date.now()
		const type = inputType
		entries[cursor] = {type, timestamp, data, ...state}
		const stayOnEntry = !active
			|| (active.timestamp + 2000 > timestamp
			&& active.type == type
			&& /\s/.test(active.data) == /\s/.test(data))
		if(stayOnEntry) return
		cursor++
		entries.splice(cursor)
	}
}

export const undo = {
	shortcut: 'Ctrl+Z',
	run: state => {
		const previous = entries[cursor - 1]
		if(!previous) return
		const type = 'historyUndo'
		const timestamp = Date.now()
		entries[cursor] = {type, timestamp, ...state}
		cursor--
		const {before, selection, after} = previous
		Object.assign(state, {before, selection, after})
		return true
	}
}

export const redo = {
	run: state => {
		const next = entries[cursor + 1]
		if(!next) return
		cursor++
		const {before, selection, after} = next
		Object.assign(state, {before, selection, after})
		return true
	}
}

export const linuxRedo = {
	shortcut: 'Ctrl+Shift+Z',
	run: redo.run
}

export const windowsRedo = {
	shortcut: 'Ctrl+Y',
	run: redo.run
}
