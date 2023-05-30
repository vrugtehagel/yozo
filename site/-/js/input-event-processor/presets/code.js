import { InputEventProcessor } from '../input-event-processor.js'

const processor = new InputEventProcessor
InputEventProcessor.presets.code = processor

const pairs = new Map
for(const pair of ['{}', '()', '[]', '""', '\'\'', '``']) pairs.set(...pair)
const reversePairs = new Map([...pairs].map(pair => pair.reverse()))

processor.register((event, state) => {
	if(event.inputType != 'insertText') return
	if(state.selection) return
	if(!reversePairs.has(event.data)) return
	if(state.afterSelection[0] != event.data) return
	state.beforeSelection += event.data
	state.afterSelection = state.afterSelection.slice(1)
	return true
})

processor.register((event, state) => {
	if(event.inputType != 'insertText') return
	const other = pairs.get(event.data)
	if(!other) return
	state.beforeSelection += event.data
	if(state.afterSelection[0] != other)
		state.afterSelection = other + state.afterSelection
	return true
})

processor.register((event, state) => {
	if(event.inputType != 'deleteContentBackward') return
	if(state.selection) return
	const other = pairs.get(state.beforeSelection.at(-1))
	if(state.afterSelection[0] != other) return
	state.beforeSelection = state.beforeSelection.slice(0, -1)
	state.afterSelection = state.afterSelection.slice(1)
	return true
})

processor.register((event, state) => {
	if(event.type != 'keydown') return
	if(event.key != 'Tab') return
	if(state.selection) return
	event.preventDefault()
	state.beforeSelection += '\t'
	return true
})

processor.register((event, state) => {
	if(event.type != 'keydown') return
	if(event.key != 'Tab') return
	if(event.shiftKey) return
	if(!state.selection) return
	event.preventDefault()
	const index = state.beforeSelection.lastIndexOf('\n') + 1
	state.beforeSelection = state.beforeSelection.slice(0, index)
		+ '\t'
		+ state.beforeSelection.slice(index)
	state.selection = state.selection.replaceAll(/\n/g, '\n\t')
	return true
})

processor.register((event, state) => {
	if(event.type != 'keydown') return
	if(event.key != 'Tab') return
	if(event.shiftKey) return
	if(state.selection) return
	event.preventDefault()
	state.beforeSelection += '\t'
	return true 
})

processor.register((event, state) => {
	if(event.type != 'keydown') return
	if(event.key != 'Tab') return
	if(!event.shiftKey) return
	event.preventDefault()
	const index = state.beforeSelection.lastIndexOf('\n') + 1
	if(state.beforeSelection[index] == '\t')
		state.beforeSelection = state.beforeSelection.slice(0, index)
			+ state.beforeSelection.slice(index + 1)
	state.selection = state.selection.replaceAll(/\n\t/g, '\n')
	return true
})

processor.register((event, state) => {
	if(event.type != 'keydown') return
	if(event.key != 's') return
	if(!event.ctrlKey && !event.metaKey) return
	event.preventDefault()
	return true
})

processor.register((event, state) => {
	if(event.inputType != 'insertLineBreak') return
	const other = pairs.get(state.beforeSelection.at(-1))
	const index = state.beforeSelection.lastIndexOf('\n') + 1
	const match = state.beforeSelection.slice(index).match(/^[ \t]*/)?.[0] ?? ''
	const isExtraIndent = other != state.beforeSelection.at(-1)
	state.beforeSelection += '\n'
	if(other && isExtraIndent) state.beforeSelection += '\t'
	state.beforeSelection += match
	if(state.afterSelection[0] == other && other != null)
		state.afterSelection = `\n${match}${state.afterSelection}`
	state.selection = ''
	return true
})

processor.register((event, state) => {
	if(event.inputType != 'insertFromPaste') return
	const {value} = event.target
	if(!value.startsWith(state.beforeSelection)) return
	if(!value.endsWith(state.afterSelection)) return
	const startIndex = state.beforeSelection.length
	const endIndex = -state.afterSelection.length
	const selection = endIndex
		? value.slice(startIndex, endIndex)
		: value.slice(startIndex)
	const lengths = selection.match(/\n */g)?.map(match => match.length - 1)
	if(!lengths) return
	if(lengths.length == 0) return
	const allDiffs = lengths.slice(1)
		.map((length, index) => length - lengths[index - 1])
		.filter(diff => diff != 0)
	const diffs = allDiffs.some(diff => diff > 0)
		? allDiffs.filter(diff => diff > 0)
		: allDiffs.map(diff => -diff)
	const counts = new Map
	for(const diff of diffs) counts.set(diff, (counts.get(diff) ?? 0) + 1)
	const [indent] = [...counts]
		.sort((entryA, entryB) => entryB[1] - entryA[1])
		[0] ?? [1]
	const regex = new RegExp(`(^|\n)((?: {${indent}})+)`, 'g')
	state.beforeSelection += selection.replaceAll(regex, (match, begin, spaces) => {
		return begin + '\t'.repeat(spaces.length / indent)
	})
	state.selection = ''
	return true
})
