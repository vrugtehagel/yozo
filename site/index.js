document.addEventListener('scroll', () => {
	document.body.classList.toggle('scrolled', window.scrollY > 5)
})
