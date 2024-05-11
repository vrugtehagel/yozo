await self.yozo.register('./bo-not-when-disconnected.yz');
const element = document.createElement('greeter-not-when-disconnected');

element.greeting = 'hello';
element.receiver = 'world';
document.body.append(element);
await 'microtask';
assert(element.textContent.trim() == 'hello, world!');

element.remove();
element.greeting = 'hi';
element.receiver = 'earth';
await 'microtask';
assert(element.textContent.trim() == 'hello, world!');

document.body.append(element);
await 'microtask';
assert(element.textContent.trim() == 'hi, earth!');
