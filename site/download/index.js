const allVersions = document.querySelector('#all-versions')
fetch('/versions.json').then(async response => {
	const versions = await response.json()
	// allVersions.replaceChildren()
})
