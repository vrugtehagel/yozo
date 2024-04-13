await self.yozo.register(`./bo-interaction.yz`);

const element = document.createElement('click-counter-interaction');
const button = element.shadowRoot.querySelector('button');
document.body.append(element);

button.click();
await 'microtask';

assert(button.textContent.trim() == '1 clicks');
assert(element.getAttribute('amount') == '1');
assert(element.amount == 1);
element.remove();
