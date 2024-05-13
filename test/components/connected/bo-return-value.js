const { Flow } = self.yozo;
await self.yozo.register('./bo-return-value.yz');

const element = document.createElement('connect-return-value');

assert(element.triggers == 0);
assert(element.returnValue instanceof Flow);

document.body.append(element);
assert(element.triggers == 1);

element.remove();
await 'microtask';
document.body.append(element);
assert(element.triggers == 2);
