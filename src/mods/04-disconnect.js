import { define } from '../define.js'


// define.public.push('disconnect')
define.register(5, Symbol(), context => {
	const callbacks = Symbol()
	const constructor = function(meta){
		meta[callbacks] = []
		meta.disconnect = callback => { meta[callbacks].push(callback) }
	}
	const disconnectedCallback = function(meta){
		meta[callbacks].forEach(callback => callback())
	}
	return {constructor, disconnectedCallback}
})
