await self.yozo.register('./bo-classes.yz');

const element = document.createElement('custom-link-classes');
const a = element.shadowRoot.querySelector('a');
document.body.append(element);

assert(a.classList.length == 1);
assert(a.classList.contains('link'));

await 'microtask';

element.to = 'https://example.com/path/to/something';
await 'microtask';
assert(a.classList.length == 2);
assert(a.classList.contains('link'));
assert(a.classList.contains('secure'));

element.to = 'https://yozo.ooo/path/to/something';
await 'microtask';
assert(a.classList.length == 3);
assert(a.classList.contains('is-yozo'));

element.remove();
