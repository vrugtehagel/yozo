await self.yozo.register(`./bo-primitive.yz`);
const element = document.createElement('drinks-primitive');
document.body.append(element);
await 'microtask';
await 'microtask';

assert(element.shadowRoot.querySelectorAll('li').length == 4);
const firstLi = element.shadowRoot.querySelector('li');
assert(firstLi.textContent.trim() == 'water');

element.add('lemonade');
await 'microtask';

assert(element.shadowRoot.querySelectorAll('li').length == 5);
