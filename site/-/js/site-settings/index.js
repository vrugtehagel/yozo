const {live, when} = self.yozo
const {$settings} = window

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

function fromLocalStorage(path, type){
	const name = `settings:${path.join(':')}`
	const $parent = path.slice(0, -1)
		.reduce(($accumulator, key) => $accumulator[`$${key}`], $settings)
	if(localStorage.getItem(name) == null)
		localStorage.setItem(name, $parent[path.at(-1)])
	live.link($parent[`$${path.at(-1)}`], {
		get: () => type(localStorage.getItem(name)),
		set: value => localStorage.setItem(name, value),
		changes: when(window).storages().if(event => event.key == name)
	})
}

const boolean = value => value != 'false'
const number = value => Number(value)
const string = value => value

fromLocalStorage(['semicolons'], boolean)
fromLocalStorage(['useTabs'], boolean)
fromLocalStorage(['tabSize'], number)
fromLocalStorage(['play', 'layout'], string)

live.link($settings.$indent, () => {
	if($settings.useTabs) return '\t'
	return ' '.repeat($settings.tabSize)
})
