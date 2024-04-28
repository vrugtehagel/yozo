const template = document.createElement('template');
template.innerHTML = `
	<template>
		<yet-undefined-from-template></yet-undefined-from-template>
	</template>
`;
document.body.append(template);

let triggers = 0;
let attempt;
window.yozo.register.auto((name) => {
	triggers++;
	attempt = name;
});

assert(triggers == 1);
assert(attempt == 'yet-undefined-from-template');

export const refresh = true;
