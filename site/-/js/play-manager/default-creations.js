export const creations = {
	'f3427b5c-af0b-4366-b85b-6d6fd8764c74': {
		name: 'To do',
		layout: 'side-by-side',
		files: {
			'df3a597c-19bb-4ba2-ba4a-49b073b456a8': {
				src: '/file/index.html',
				body: `
 - Fix preview close-opening when navigating
 - Show scripting errors
 - Show console logs
 - Show ping() and pong() (maybe just ping(color)?)
`
			}
		},
		spaces: [
			'file:df3a597c-19bb-4ba2-ba4a-49b073b456a8',
			'',
			'',
			''
		]
	},
	'2d7472ef-3655-4857-8241-df1a403f285b': {
		name: 'Boilerplate',
		layout: 'side-by-side',
		files: {
			'30c9e938-e38c-49ca-925e-c799344bb7ee': {
				src: '/file/index.html',
				body: `<!DOCTYPE html>
<meta charset="utf-8">
<script src="/dev.js"></script>
<link rel="stylesheet" href="./styles.css">
<title>Untitled</title>

<h1>Hello world!</h1>
`
			},
			'e52d767f-4489-4983-82a3-743a87a81eca': {
				src: '/file/styles.css',
				body: `body {
	background-color: black;
	color: white;
	font-family: arial, sans-serif;
}
`
			}
		},
		spaces: [
			'file:30c9e938-e38c-49ca-925e-c799344bb7ee',
			'preview:/file/index.html',
			'',
			''
		]
	}
}