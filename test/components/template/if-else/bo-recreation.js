await self.yozo.register('./bo-recreation.yz');
const element = document.createElement('color-swatch-recreation');
document.body.append(element);

const noSpan = element.shadowRoot.querySelector('span');
assert(noSpan == null);

await 'microtask';
const firstSpan = element.shadowRoot.querySelector('span');
assert(firstSpan.textContent.trim() == 'red');

element.next();
await 'microtask';

element.next();
await 'microtask';

const secondSpan = element.shadowRoot.querySelector('span');
assert(secondSpan.textContent.trim() == 'red');
assert(firstSpan != secondSpan);
