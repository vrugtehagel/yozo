import { define } from '../define.js'
import { Flow } from '../flow.js'
import { track } from '../track.js'
import { S, R, compose } from '../utils.js'


define.register(2, 'meta', (context, argslist) => {
	context.hook = (hook, unhook) => {
		const constructor = function(meta){
			meta.x[hook] = callback => {
				const item = [new Flow().then((...args) => {
					item[1]?.undo()
					item[1] = track.undo(() => callback?.(...args))
				}).cleanup(() => {
					item[1]?.undo()
					meta.x[hook][R].delete(item)
				})]
				meta.x[hook][R].add(item)
				if(meta.x[hook][S]) queueMicrotask(() => item[0].now(...meta.x[hook][S]))
				return item[0]
			}
			meta.x[hook][R] = new Set
		}
		const hookCallback = function(meta, ...args){
			meta.x[hook][S] = args
			for(const item of meta.x[hook][R]) item[0].now(...args)
		}
		if(!unhook) return {constructor, [`${hook}Callback`]: hookCallback}
		return {
			constructor,
			[`${hook}Callback`]: hookCallback,
			[`${unhook}Callback`]: function(meta, ...args){
				meta.x[hook][S] = null
				for(const item of meta.x[hook][R]) item[1]?.undo()
			}
		}
	}

	const hooks = [
		...argslist,
		[{hook: 'connected', unhook: 'disconnected'}],
		[{hook: 'disconnected'}]
	]
	hooks.filter(args => args[0].hook).map(args => context.x.add(args[0].hook))
	return compose(hooks
		.filter(args => args[0].hook)
		.map(args => context.hook(args[0].hook, args[0].unhook))
	)
})
