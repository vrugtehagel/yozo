await self.yozo.register('./bo-casing.yz');
const element = document.createElement('hello-casing');
document.body.append(element);
element.setAttribute('first-name', 'John');

assert(element.firstName == 'John');
await 'microtask';
assert(element.shadowRoot.textContent.trim() == 'Hello John');

element.firstName = 'Maria';

assert(element.getAttribute('first-name') == 'Maria');
