const element = document.createElement('yet-undefined-from-document');
document.body.append(element);

let triggers = 0
let attempt
window.yozo.register.auto(name => {
	triggers++
	attempt = name
});

assert(triggers == 1);
assert(attempt == 'yet-undefined-from-document')

export const refresh = true
