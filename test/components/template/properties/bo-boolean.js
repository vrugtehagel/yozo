await self.yozo.register('./bo-boolean.yz');
const element = document.createElement('togglable-boolean');
document.body.append(element);
const span = element.shadowRoot.querySelector('span');

await 'microtask';
assert(!span.hidden);

element.visibility = 'hidden';
await 'microtask';
assert(span.hidden);
