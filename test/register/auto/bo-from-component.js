const element = document.createElement('register-from-component');
document.body.append(element);

let triggers = 0;
let attempt;
window.yozo.register.auto((name) => {
	triggers++;
	attempt = name;
	if (name == 'register-from-component') {
		return './bo-from-component.yz';
	}
});

await customElements.whenDefined('register-from-component');

assert(triggers == 2);
assert(attempt == 'yet-undefined-from-component');

export const refresh = true;
