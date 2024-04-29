await self.yozo.register('./bo-in-script.yz');

const element = document.createElement('animal-sound-in-script');
document.body.append(element);

element.animal = 'cat';
await 'microtask';

assert(element.textContent == 'meow');

element.animal = 'dog';
await 'microtask';

assert(element.textContent == 'woof');
