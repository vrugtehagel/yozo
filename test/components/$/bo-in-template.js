await self.yozo.register('./bo-in-template.yz');

const element = document.createElement('animal-sound-in-template');
document.body.append(element);

element.animal = 'cat';
await 'microtask';

assert(element.textContent.trim() == 'meow');

element.animal = 'dog';
await 'microtask';

assert(element.textContent.trim() == 'woof');
