await self.yozo.register(`./bo-primitive-shadowless.yz`);
const element = document.createElement('drinks-primitive-shadowless');
document.body.append(element);
await 'microtask';

assert(element.querySelectorAll('li').length == 4);

element.add('lemonade');
await 'microtask';

assert(element.querySelectorAll('li').length == 5);
