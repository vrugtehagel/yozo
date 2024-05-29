await self.yozo.register('./bo-every-disconnect.yz');

const element = document.createElement('disconnect-every-disconnect');
document.body.append(element);
assert(element.count == 0);

element.remove();
assert(element.count == 1);

document.body.append(element);
await 'microtask';
element.remove();
assert(element.count == 2);
