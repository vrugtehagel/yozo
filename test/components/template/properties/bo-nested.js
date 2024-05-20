await self.yozo.register('./bo-nested.yz');
const element = document.createElement('colored-text-nested');
document.body.append(element);
const span = element.shadowRoot.querySelector('span');
const slot = element.shadowRoot.querySelector('slot');
element.color = 'red';
element.bgcolor = 'white';

await 'microtask';

assert(slot.style.color == 'red');
assert(span.style.backgroundColor == 'white');
