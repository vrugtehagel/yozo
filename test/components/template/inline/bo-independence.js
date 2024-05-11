await self.yozo.register('./bo-independence.yz');
const element = document.createElement('greeter-independence');

element.greeting = 'hello';
element.receiver = 'world';
document.body.append(element);
await 'microtask';
assert(element.textContent.trim() == 'hello, world!');

element.greeting = 'hi';
element.receiver = 'earth';
await 'microtask';
assert(element.textContent.trim() == 'hello, earth!');
