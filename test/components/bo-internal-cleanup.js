await self.yozo.register('./bo-internal-cleanup.yz');

const element = document.createElement('click-counter-internal-cleanup');
document.body.append(element);
await 'microtask';

const button = element.shadowRoot.querySelector('button');

button.click();
assert(element.amount == 1);

element.remove();
button.click();
assert(element.amount == 1);
