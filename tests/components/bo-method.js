await self.yozo.register(`./bo-method.yz`);

const element = document.createElement('click-counter-method');
document.body.append(element);

element.increment();
element.increment();
await 'microtask';

assert(element.amount == 2);
element.remove();
