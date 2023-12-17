window.Prism = {manual: true}
await import('./prism.js')
export const Prism = window.Prism
delete window.Prism


// These are 'special' tokens. null and undefined are added as well.
Prism.languages.insertBefore('javascript', 'keyword', {
	meta: {
		pattern: /(?:(\bimport\s*\.\s*)meta\b)|(?:\b(null|undefined|this|super|arguments)\b)/,
		lookbehind: true
	}
})

// Globals that I'd like to give highlighting
Prism.languages.js.native = /\bwindow|console|document\b/

// Yozo component syntax is just HTML with some additional JS contexts
Prism.languages.yz = Prism.languages.extend('markup', {
	['inline-expression']: {
		pattern: /{{.*?}}/,
		inside: {
			punctuation: {pattern: /(?:^{{|}}$)/},
			value: {
				pattern: /[^]*/,
				alias: ['javascript', 'language-javascript'],
				inside: Prism.languages.js
			}
		}
	}
})

// Adding the JS-based attributes to YZ highlighting (bit hacky but eh)
const addAttributeSource = Prism.languages.markup.tag.addAttribute.toString()
	.replace('Prism.languages.markup', 'Prism.languages.yz')
eval(`(${addAttributeSource})('(?:on\\\\w+|[@:.#][-\\\\w.]+)', 'javascript')`)
