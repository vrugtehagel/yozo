const component = document.createElement('register-once-per-name');
document.body.append(component);
const element = document.createElement('yet-undefined-once-per-name');
document.body.append(element);

let triggers = 0
window.yozo.register.auto(name => {
	triggers++
})

assert(triggers == 2);

await yozo.register('./bo-once-per-name.yz')
assert(triggers == 2);

export const refresh = true
