const {live, when} = self.yozo

const getters = {
	json: value => JSON.parse(value),
	boolean: value => value == 'true',
	string: value => value,
	number: value => Number(value),
	array: value => value.split(',')
}
const setters = {
	json: value => JSON.stringify(value),
	boolean: value => Boolean(value),
	string: value => value || '',
	number: value => value,
	array: value => value.join(',')
}

export function local($live, name, {type, fallback}){
	if(fallback != null && localStorage.getItem(name) == null)
		localStorage.setItem(name, setters[type](fallback))
	live.link($live, {
		get: () => getters[type](localStorage.getItem(name)),
		set: value => localStorage.setItem(name, setters[type](value)),
		changes: when(window).storages().if(({key}) => key == name)
	})
}

export function session($live, name, {type, fallback}){
	if(fallback != null && sessionStorage.getItem(name) == null)
		sessionStorage.setItem(name, setters[type](fallback))
	live.link($live, {
		get: () => getters[type](sessionStorage.getItem(name)),
		set: value => sessionStorage.setItem(name, setters[type](value))
	})
}
