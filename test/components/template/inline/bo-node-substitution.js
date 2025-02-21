await self.yozo.register('./bo-node-substitution.yz');
const element = document.createElement('greeter-node-substitution');

const span = document.createElement('span');
const em = document.createElement('em');
span.textContent = 'hello';
em.textContent = 'world';
element.greeting = span;
element.receiver = em;
document.body.append(element);
await 'microtask';
assert(element.textContent.trim() == 'hello, world!');

element.greeting = 'hi';
em.textContent = 'earth';
await 'microtask';
assert(element.textContent.trim() == 'hi, earth!');

element.greeting = span;
await 'microtask';
assert(element.textContent.trim() == 'hello, earth!');
