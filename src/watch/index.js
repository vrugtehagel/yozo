import { errors } from '../development/index.js' //
import { Thenable } from '../thenable.js'
import { when } from '../when.js'
import { track } from '../track.js'

import { addToWatch } from './add-to-watch.js'
import { Reference } from './reference.js'
import { symbol } from './symbol.js'


export function watch(thing){
	return new Reference({value:
		{$: watch.get(thing)}
	}, '$').out
}

watch.get = $watched => {
	if(!$watched?.[symbol]) return $watched
	addToWatch($watched)
	return $watched[symbol].value
}

watch.set = ($watched, value) => {
	if(!$watched?.[symbol]) return false
	const {key} = $watched[symbol] //
	if(Object.keys(watch).includes(key)) //
		errors.warn('unsafe-watched-value', {key}) //
	return $watched[symbol].do(() => 
		$watched[symbol].parent.value[
			$watched[symbol].key
		] = watch.get(value)
	)
}

watch.delete = $watched => {
	if(!$watched?.[symbol]) return false
	return $watched[symbol].do(() =>
		delete $watched[symbol].parent.value[
			$watched[symbol].key
		]
	)
}

watch.bind = ($watched, options) => {
	if(!$watched[symbol]) return
	if(options instanceof EventTarget){
		const input = options
		options = {
			get: () => input.value,
			set: value => input.value = value,
			changes: when(input).input()
		}
	}
	if(typeof options == 'function') options = {get: options}
	let watcher
	let changing = false
	let triggerManually
	const allowManualTriggers = options.changes
	const changes = new Thenable(trigger => {
		if(options.changes) return watcher = options.changes
			.then(() => trigger(track.ignore(() => options.get())))
		const update = () => {
			const call = track.watched(options.get)
			trigger(call.result)
			watcher = track.ignore(() => when(call.watched).change()).once().then(update)
		}
		watcher = new Thenable(() => {}).then(update)
	}).then(value => {
		triggerManually = false
		changing = true
		track.ignore(() => watch.set($watched, value))
		changing = false
	}).cleanup(() => {
		watcher.die()
		onchange.die()
	})
	const onchange = track.ignore(() => when($watched).change()).then(({detail}) => {
		if(!changing) track.ignore(() => {
			triggerManually = allowManualTriggers
			if(options.set) options.set(detail.value)
			else changes.now(detail.oldValue)
			if(triggerManually) watcher.now()
		})
	})
	watcher.now()
	return changes
}
