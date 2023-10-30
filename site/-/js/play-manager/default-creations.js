const {origin} = window.location

export const creations = {
	'2d7472ef-3655-4857-8241-df1a403f285b': {
		name: 'Hello world',
		layout: 'side-by-side',
		files: {
			'30c9e938-e38c-49ca-925e-c799344bb7ee': {
				src: '/file/index.html',
				body: '<!DOCTYPE html>\n<meta charset=\"utf-8\">\n<script src=\"/dev-latest.js\"></script>\n<link rel=\"stylesheet\" href=\"./styles.css\">\n<script>\n\tyozo.register(\'/file/component.yz\');\n</script>\n<title>Basic component example</title>\n\n\n<say-hi to=\"world\"></say-hi>\n'
			},
			'e52d767f-4489-4983-82a3-743a87a81eca': {
				src: '/file/styles.css',
				body: 'body {\n\tmargin: 4rem 2rem;\n\tcolor: white;\n\tbackground-color: #181823;\n\tfont-size: 1rem;\n\tline-height: 1.5;\n\tfont-family: arial, sans-serif;\n}'
			},
			'11371410-b185-484e-a06b-fe34ab094ee8': {
				src: '/file/component.yz',
				body: '<title>say-hi</title>\n<meta attribute=\"to\" type=\"string\">\n\n<template mode=\"closed\">\n\tHello {{ $.to }}!\n</template>\n\n<style>\n:host {\n\tfont-size: 2rem;\n}\n</style>'
			}
		},
		spaces: [
			'file:30c9e938-e38c-49ca-925e-c799344bb7ee',
			`preview:${origin}/file/index.html`,
			'',
			''
		]
	},
	'8ee5a9cd-1b83-498a-b247-89d2eb8379f6': {
		name: 'README',
		layout: 'side-by-side',
		files: {
			'30c9e938-e38c-49ca-925e-c799344bb7ee': {
				src: '/file/index.html',
				body: '<!DOCTYPE html>\n<meta charset=\"utf-8\">\n<script src=\"/dev-latest.js\"></script>\n<script src=\"/file/scripts.js\" defer></script>\n<link rel=\"stylesheet\" href=\"./styles.css\">\n<title>README</title>\n\n<main>\n<h1>Welcome!</h1>\n\n<p>This is Yozo\'s playground. It is designed\nto get out of your way, and give you ultimate\ncontrol. There\'s really nothing you\n<em>need</em> to know to use the sandbox, but\nsee below for some handy tips and tricks to\nget the most out of it.</p>\n\n<h2>Presets & saving</h2>\n<p>The playground lets you create different\n\"presets\". Each preset is simply a set of\nfiles. Changes you make to files in a preset\nare <em>not</em> saved automatically. This is\nso that you can do messy rapid tests without\nhaving to clean up when you come back.</p>\n<p>The presets you save are saved to\nlocalStorage. This means you can access them\nfrom the browser you created them in without\nneeding to log in. To prevent mistakes (like\naccidental reloads), edits are kept in\nsessionStorage for the duration of your\nsession.</p>\n\n<h2>Your files are \"real\"</h2>\n<p>Unlike most other playgrounds, the files\nyou create are \"real\" files. For example, this\nHTML file does not exist on Yozo\'s servers,\nyet you can <a href=\"/file/index.html\"\ntarget=\"_blank\">visit it</a> like a normal\nwebsite. This means you can treat the sandbox\nlike, well, a \"real\" environment. To use Yozo\nin the sandbox, you\'ll need to include it in\nyour pages as you normally would, through\n<code>&lt;script src=\"/dev.js\"&gt;</code>.\nThe beautiful thing is that you can now\nimport, fetch, link, do anything you want.\nThe URLs under <code>/file/</code> are all\nyours!</p>\n\n<h2>Ping & pong</h2>\n<p>Every seasoned developer knows how to\nsprinkle console logs through code to locate a\nbug. So, I made something to help with that;\nyour sandbox environment gets two new globals,\n<code>ping()</code> and <code>pong()</code>.\nThey light up the two lights in the bottom\nleft corner of the preview window. Now, you\ncan locate those pesky bugs without the need\nto litter the console with messages!</p>\n<div id=\"try-ping-pong\">\n\t<button id=\"ping\">ping()</button>\n\t<button id=\"pong\">pong()</button>\n</div>\n\n<h2>Getting started</h2>\n<p>If you want to have a quick look at Yozo\nin action, check out the other presets.\nThey show off the simplicity of developing\nwith Yozo. If you want to make your own\npresets, you can create a fresh new one or\nduplicate any existing preset and modify it\nto your heart\'s content. Enjoy!</p>\n\n<h2>Issues & feedback</h2>\n<p>You can file issues or submit feedback for\nYozo on\n<a href=\"https://github.com/vrugtehagel/yozo/issues\">\nGitHub</a>. It is much appreciated!</p>\n</main>\n'
			},
			'e52d767f-4489-4983-82a3-743a87a81eca': {
				src: '/file/styles.css',
				body: 'body {\n\tmargin: 4rem 2rem;\n\tcolor: white;\n\tbackground-color: #181823;\n\tfont-size: 1rem;\n\tline-height: 1.5;\n\tfont-family: arial, sans-serif;\n}\n\nmain {\n\tmax-width: 800px;\n\tmargin: 0 auto;\n}\n\ncode {\n\tbackground-color: #292437;\n\tpadding: .25rem .5rem;\n\tborder-radius: .25rem;\n}\n\na {\n\tcolor: #8BE9FD;\n}\n\n#try-ping-pong {\n\tdisplay: flex;\n\tgap: 1rem;\n\tjustify-content: center;\n}\n\nbutton {\n\tpadding: .75rem 1.5rem;\n\tborder: none;\n\tfont-size: 1rem;\n\tborder-radius: .5rem;\n\tcolor: #181823;\n\ttransition: .2s;\n\tcursor: pointer;\n\t&:hover { opacity: .8; }\n}\n\n#ping {\n\tbackground-color: #FF79C6;\n}\n\n#pong {\n\tbackground-color: #8BE9FD;\n}'
			},
			'd63533b3-372e-480f-90a6-96d7952ac74e': {
				src: '/file/scripts.js',
				body: 'const {when} = yozo\n\nconst pingButton = document.querySelector(\'#ping\');\nconst pongButton = document.querySelector(\'#pong\');\n\nwhen(pingButton).clicks().then(() => ping());\nwhen(pongButton).clicks().then(() => pong());\n'
			}
		},
		spaces: [
			`preview:${origin}/file/index.html`,
			'',
			'',
			''
		]
	},
	'253c343f-632c-435c-b460-ad6a5f1cd7b9': {
		name: 'Click counter',
		layout: 'side-by-side',
		files: {
			'30c9e938-e38c-49ca-925e-c799344bb7ee': {
				src: '/file/index.html',
				body: '<!DOCTYPE html>\n<meta charset=\"utf-8\">\n<script src=\"/dev-latest.js\"></script>\n<link rel=\"stylesheet\" href=\"./styles.css\">\n<script>\n\tyozo.register(\'/file/component.yz\');\n</script>\n<title>Click counter</title>\n\n<click-counter amount=\"0\"></click-counter>\n'
			},
			'e52d767f-4489-4983-82a3-743a87a81eca': {
				src: '/file/styles.css',
				body: 'body {\n\tmargin: 2rem;\n\tcolor: white;\n\tbackground-color: #181823;\n\tfont-size: 1rem;\n\tline-height: 1.5;\n\tfont-family: arial, sans-serif;\n}\n\n/* This doesn\'t affect the button in the\ncomponent, thanks to scoped styles we get\nby using a shadow root! */\nbutton {\n\tcolor: red;\n}\n'
			},
			'2eba766f-231c-4ab8-a6b9-8db1ce031f3e': {
				src: '/file/component.yz',
				body: '<title>click-counter</title>\n<meta attribute=\"amount\" type=\"number\">\n<meta method=\"reset\">\n\n<template mode=\"closed\">\n\t<button @click=\"$.amount++\">\n\t\tClicked {{ $.writtenAmount }}\n\t</button>\n</template>\n<script>\n$.reset = () => $.amount = 0;\nlive.link($.$writtenAmount, () => {\n\tif($.amount == 1) return \'once\';\n\tif($.amount == 2) return \'twice\';\n\treturn `${$.amount} times`;\n});\n</script>\n<style>\n:host {\n\tdisplay: block;\n}\nbutton {\n\tpadding: .75rem 1.5rem;\n\tborder: none;\n\tfont-size: 1rem;\n\tborder-radius: .5rem;\n\tcolor: #181823;\n\tbackground-color: #FFB86C;\n\ttransition: .2s;\n\tcursor: pointer;\n\t&:hover { opacity: .8; }\n}\n</style>\n'
			}
		},
		spaces: [
			'file:2eba766f-231c-4ab8-a6b9-8db1ce031f3e',
			`preview:${origin}/file/index.html`,
			'',
			''
		]
	}
}
