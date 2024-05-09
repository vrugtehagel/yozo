await self.yozo.register('./bo-binding.yz');
const element = document.createElement('secret-binding');
document.body.append(element);

assert(element.changes == 0);

element.secret = 'foo';

assert(element.secret == 'foo');
assert(element.changes == 1);
