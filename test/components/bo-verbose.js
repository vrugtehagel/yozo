await self.yozo.register('./bo-verbose.yz');
const element = document.createElement('click-counter-verbose');
const button = element.shadowRoot.querySelector('button');
document.body.append(element);

button.click();
element.increment();
await 'microtask';

assert(button.textContent.trim() == '2 clicks');
assert(element.getAttribute('amount') == '2');
assert(element.amount == 2);
element.remove();
