import { define } from '../define.js'
import { Flow } from '../flow.js'
import { track } from '../track.js'
import { S, R, compose } from '../utils.js'


define.register(3, 'meta', (context, argslist) => {
	context.hook = (hook, unhook) => {
		const constructor = function(meta){
			meta.x[hook] = callback => {
				const item = [callback]
				meta.x[hook][R].add(item)
				if(meta.x[hook][S]) item[1] = track.flows(() => item[0](...meta.x[hook][S]))
				const flow = new Flow().cleanup(() => {
					item[1]?.flows.stop()
					meta.x[hook][R].delete(item)
				})
				track.add('flows', flow)
				return flow
			}
			meta.x[hook][R] = new Set
		}
		const hookCallback = function(meta, ...args){
			meta.x[hook][S] = args
			for(const item of meta.x[hook][R]){
				item[1]?.flows.stop()
				item[1] = track.flows(() => item[0](...args))
			}
		}
		if(!unhook) return {constructor, [`${hook}Callback`]: hookCallback}
		return {
			constructor,
			[`${hook}Callback`]: hookCallback,
			[`${unhook}Callback`]: function(meta, ...args){
				meta.x[hook][S] = null
				for(const item of meta.x[hook][R]) item[1]?.flows.stop()
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
