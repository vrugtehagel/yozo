const { Flow } = globalThis.yozo;
await globalThis.yozo.register('./bo-retroactive.yz');

const element = document.createElement('connect-retroactive');
document.body.append(element);

await 'microtask';

let triggers = 0;
element.connected(() => triggers++);
await 'microtask';

assert(triggers == 1);
