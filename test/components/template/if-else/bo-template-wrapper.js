await self.yozo.register('./bo-template-wrapper.yz');
const element = document.createElement('color-swatch-template-wrapper');
document.body.append(element);

await 'microtask'
assert(element.shadowRoot.textContent.trim() == 'red');
assert(!element.shadowRoot.querySelector('*'));

element.next()
element.next()
await 'microtask'
const allElements = element.shadowRoot.querySelectorAll('*');
assert(element.shadowRoot.textContent.trim() == 'green');
assert(allElements.length == 1);
assert(allElements[0].localName == 'em');
