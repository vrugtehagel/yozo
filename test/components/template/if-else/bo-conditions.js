await self.yozo.register('./bo-conditions.yz');
const element = document.createElement('color-swatch-conditions');
document.body.append(element);

await 'microtask'
assert(element.shadowRoot.children.length == 1);
assert(element.shadowRoot.textContent.trim() == 'red');

element.next()
await 'microtask'
assert(element.shadowRoot.textContent.trim() == 'blue');

element.next()
await 'microtask'
assert(element.shadowRoot.textContent.trim() == 'green');

element.next()
await 'microtask'
assert(element.shadowRoot.textContent.trim() == 'yellow');

element.next()
await 'microtask'
assert(element.shadowRoot.textContent.trim() == 'red');
