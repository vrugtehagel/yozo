await self.yozo.register(`./bo-number-default.yz`);
const element = document.createElement('age-number-default');
document.body.append(element);

assert(element.age == 30);
assert(typeof element.age == 'number');

element.age = '23';

assert(element.getAttribute('age') == '23');
assert(element.age == 23);
assert(typeof element.age == 'number');
await 'microtask';
