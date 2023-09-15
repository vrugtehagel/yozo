const cache = new Map

export async function get(src){
	const url = new URL(src, `${window.location.origin}/-/svg/`)
	const {pathname} = url
	if(cache.has(pathname)) return cache.get(pathname).cloneNode(true)
	if(!pathname.startsWith('/-/svg/')) return null
	const response = await fetch(url).catch(() => null)
	if(!response?.ok) return null
	const text = await response.text()
	const template = document.createElement('template')
	template.innerHTML = text
	cache.set(pathname, template.content)
	return template.content.cloneNode(true)
}
