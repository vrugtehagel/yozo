await self.yozo.register(`./bo-object.yz`);
const element = document.createElement('drinks-object');
document.body.append(element);
await 'microtask';

element.updateFirst('lemonade');
await 'microtask';

const firstLi = element.shadowRoot.querySelector('li');
assert(firstLi.textContent.trim() == 'lemonade');
