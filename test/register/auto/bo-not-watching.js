let triggers = 0
window.yozo.register.auto(name => {
	triggers++
});

const element = document.createElement('yet-undefined-from-document');
document.body.append(element);

assert(triggers == 0);

export const refresh = true
