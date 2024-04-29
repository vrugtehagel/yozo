await self.yozo.register('./bo-in-flow-control.yz');

const element = document.createElement('animal-sound-in-flow-control');
document.body.append(element);

element.animal = 'cat';
await 'microtask';

assert(element.textContent.trim() == 'meow');

element.animal = 'dog';
await 'microtask';

assert(element.textContent.trim() == 'woof');
