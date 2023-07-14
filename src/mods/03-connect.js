import { define } from '../define.js'
import { Flow } from '../flow.js'
import { track } from '../track.js'


// define.public.push('connect')
define.register(4, Symbol(), context => {
	const items = Symbol()
	const connected = Symbol()
	const constructor = function(meta){
		meta[items] = new Set
		meta.connect = callback => {
			const item = [callback]
			meta[items].add(item)
			if(meta[connected]) item[1] = track.flows(item[0])
			const flow = new Flow().cleanup(() => {
				item[1]?.flows.stop()
				meta[items].delete(item)
			})
			track.add('flows', flow)
			return flow
		}
	}
	const connectedCallback = function(meta){
		meta[connected] = true
		meta[items].forEach(item => item[1] = track.flows(item[0]))
	}
	const disconnectedCallback = function(meta){
		meta[connected] = false
		meta[items].forEach(item => item[1]?.flows.stop())
	}
	return {constructor, connectedCallback, disconnectedCallback}
})
