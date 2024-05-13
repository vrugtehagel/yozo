const { Flow } = self.yozo;
await self.yozo.register('./bo-retroactive.yz');

const element = document.createElement('connect-retroactive');
document.body.append(element);

await 'microtask';

let triggers = 0;
element.connected(() => triggers++);
await 'microtask';

assert(triggers == 1);
