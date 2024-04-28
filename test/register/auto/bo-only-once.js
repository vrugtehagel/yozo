const element = document.createElement('yet-undefined-from-document');
document.body.append(element);

let triggers = 0;
window.yozo.register.auto((name) => {});
window.yozo.register.auto((name) => {
	triggers++;
});

assert(triggers == 0);

export const refresh = true;
