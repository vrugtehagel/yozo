import { define } from '../define.js'
import { Flow } from '../flow.js'
import { monitor } from '../monitor.js'
import { compose } from '../utils.js'


// Here we define hooks such as connected() and disconnected()
// We also allow custom hooks

define.register(2, 'meta', (context, argslist) => {
	// Basically, you can define an "unhook" for a hook to determine when to
	// take down items set up in the hook. For example, stuff set up in the
	// connected() handler needs to be taken down when disconnecting.
	// On the other hand stuff that happens in the disconnected() handler
	// is taken down just next time it runs

	return compose([
		...argslist,
		[{hook: 'connected', unhook: 'disconnected'}],
		[{hook: 'disconnected'}]
	].map(args => {
		const {hook, unhook} = args[0]
		if(!hook) return {}

		const items = Symbol()
		const queuedArgs = Symbol()

		// This exposes the hook inside the template as a variable
		// it'll be looked up in meta.x[…]
		context.x.add(hook)
		const constructor = function(meta){
			meta.x[hook] = callback => {
				// For each hook call, we keep a [Flow, ?{undo}] pair
				// The flow is for monitorability, cleanup and we return it
				// Every time it runs, it undoes the previous run (if exists)
				// and then remembers the undo handler for next call
				const item = [new Flow().then((...args) => {
					item[1]?.undo()
					item[1] = monitor(['undo'], () => callback?.(...args))
				}).cleanup(() => {
					item[1]?.undo()
					meta[items].delete(item)
				})]
				meta[items].add(item)
				// Fire "immediately" if the hook has already fired before
				// calling the hook itself
				if(meta[queuedArgs])
					queueMicrotask(() => item[0].now(...meta[queuedArgs]))
				return item[0]
			}

			// This is where we dump all the [Flow, ?{undo}] pairs that are still alive
			meta[items] = new Set
		}

		if(!unhook) return {
			constructor,
			[`${hook}Callback`]: function(meta, ...args){
				meta[queuedArgs] = args
				for(const item of meta[items]) item[0].now(...args)
			}
		}

		return {
			constructor,
			[`${hook}Callback`]: function(meta, ...args){
				meta[queuedArgs] = args
				for(const item of meta[items]) item[0].now(...args)
			},
			[`${unhook}Callback`]: function(meta, ...args){
				meta[queuedArgs] = null
				for(const item of meta[items]) item[1]?.undo()
			}
		}
	}))
})
