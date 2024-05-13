await self.yozo.register('./bo-every-connect.yz');

const element = document.createElement('connect-every-connect');

assert(element.count == 0);

document.body.append(element);
assert(element.count == 1);

element.remove();
await 'microtask';
document.body.append(element);
assert(element.count == 2);
