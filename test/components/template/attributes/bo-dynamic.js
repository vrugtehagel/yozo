await self.yozo.register('./bo-dynamic.yz');

const element = document.createElement('custom-link-dynamic');
const a = element.shadowRoot.querySelector('a');
document.body.append(element);

await 'microtask';
assert(a.getAttribute('href') == '#');

element.to = '/path/to/something';
await 'microtask';
assert(a.getAttribute('href') == '/path/to/something');

element.remove();
