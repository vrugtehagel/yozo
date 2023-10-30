const {when} = self.yozo

const aside = document.querySelector('aside')
const nav = aside.querySelector('nav')
const article = document.querySelector('article')
const headers = article.querySelectorAll('h1,h2,h3,h4,h5,h6')
const inView = new Set
for(const header of headers){
	const level = Number(header.localName[1])
	const text = header.textContent.trim()
	header.id ||= text.toLowerCase()
		.replaceAll(/[^$\w]+/g, '-')
		.replaceAll(/^-|-$/g, '')
	const a = document.createElement('a')
	a.href = `#${header.id}`
	header.append(a.cloneNode(false))
	a.textContent = header.textContent
	a.dataset.level = level
	nav.append(a)

	const rootMargin = '-90px 0px -50%' // scroll-padding is 6rem (96px)
	const threshold = 1
	const options = {rootMargin, threshold}
	when(header).observes('intersection', options).then(([entry]) => {
		const {isIntersecting, boundingClientRect} = entry
		const {y} = boundingClientRect
		const isAtTop = y < 100
		if(isIntersecting) inView.add(a)
		else inView.delete(a)
		if(isIntersecting && !isAtTop && inView.size != 1) return
		if(!isIntersecting && !isAtTop && inView.size > 0) return
		document.querySelector('.current')?.classList.remove('current')
		if(isIntersecting) return a.classList.add('current')
		if(!isAtTop) return a.previousElementSibling.classList.add('current')
		if(inView.size == 0) return a.classList.add('current')
		return a.nextElementSibling.classList.add('current')
	})
}

