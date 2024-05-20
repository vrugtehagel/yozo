await self.yozo.register('./bo-not-when-disconnected.yz');

const element = document.createElement('colored-text-not-when-disconnected');
const span = element.shadowRoot.querySelector('span');
document.body.append(element);
element.color = 'blue';

await 'microtask';
assert(span.style.color == 'blue');

element.remove();
element.color = 'red';
await 'microtask';
assert(span.style.color == 'blue');

document.body.append(element);
await 'microtask';
assert(span.style.color == 'red');
