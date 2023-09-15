// test URL:
// https://6wrlmkp9u2.execute-api.us-east-1.amazonaws.com/?sleep=500
const {when} = yozo


export class IFrameBrowser extends EventTarget {
	#iframe
	#src = 'about:blank'
	#valid = true

	get iframe(){ return this.#iframe }
	get valid(){ return this.#valid }
	get sameOrigin(){
		try {
			return new URL(this.#src).origin == window.location.origin
		} catch {
			return false
		}
	}

	constructor(iframe){
		super()
		this.#iframe = iframe
	}

	async go(src){
		this.#valid = true
		src = src.trim()
		if(!src) return this.#invalid()
		const isBlank = src == 'about:blank'
		if(src.startsWith('/')) src = `${window.location.origin}${src}`
		if(!src.match(/^https?:\/\//)) src = `https://${src}`
		try { src = new URL(src).href }
		catch { src = 'about:blank' }
		if(!isBlank && src == 'about:blank') return this.#invalid()
		const iframe = this.#iframe
		const detail = {src}
		await when(iframe).loads().once().after(() => {
			iframe.src = src
			this.#src = src
			this.dispatchEvent(new CustomEvent('navigate', {detail}))
		})
		this.dispatchEvent(new CustomEvent('complete'))
	}

	cancel(){
		if(this.sameOrigin) this.#iframe.contentWindow?.stop()
		else this.#iframe.src = 'about:blank'
		this.dispatchEvent(new CustomEvent('complete'))
	}

	reload(){
		this.go(this.#src)
	}

	injectHTML(html, selector = 'head'){
		if(!this.sameOrigin) return
		const target = this.#iframe.contentDocument?.querySelector(selector)
		if(!target) return
		target.insertAdjacentHTML('afterbegin', html)
	}

	#invalid(){
		this.#valid = false
		this.dispatchEvent(new CustomEvent('error'))
	}

}
