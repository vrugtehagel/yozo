const {live, when} = self.yozo

live.set($settings, {
	semicolons: true,
	useTabs: true,
	tabSize: 4,
	indent: '\t',
	play: {
		layout: window.innerWidth > 700 ? 'side-by-side' : 'stack',
		presets: [],
		custom: []
	}
})

const fromLocalStorage = ($live, key, type) => {
	const name = `settings:${key}`
	if(localStorage.getItem(name) == null)
		localStorage.setItem(name, $live[key])
	live.link($live[`$${key}`], {
		get: () => localStorage.getItem(name),
		set: value => type(localStorage.setItem(name, value)),
		changes: when(window).storages().if(event => event.key == name)
	})
}

fromLocalStorage($settings, 'semicolons', Boolean)
fromLocalStorage($settings, 'useTabs', Boolean)
fromLocalStorage($settings, 'tabSize', Number)
fromLocalStorage($settings.$play, 'layout', String)

live.link($settings.$indent, () => {
	if($settings.useTabs) return '\t'
	return ' '.repeat($settings.tabSize)
})
