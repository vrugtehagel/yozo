await self.yozo.register('./bo-monitored.yz');

const element = document.createElement('disconnect-monitored');
document.body.append(element);

element.remove();
await 'microtask';
document.body.append(element);
assert(element.undos == 0);

element.remove();
assert(element.undos == 1);
