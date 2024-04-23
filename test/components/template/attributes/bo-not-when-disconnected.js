await self.yozo.register('./bo-not-when-disconnected.yz');

const element = document.createElement('custom-link-not-when-disconnected');
const a = element.shadowRoot.querySelector('a');
document.body.append(element);

await 'microtask';
assert(a.getAttribute('href') == '#');

element.remove();
element.to = '/path/to/something';
await 'microtask';
assert(a.getAttribute('href') == '#');

document.body.append(element);
await 'microtask';
assert(a.getAttribute('href') == '/path/to/something');
