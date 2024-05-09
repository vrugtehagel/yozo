await self.yozo.register('./bo-no-case-conversion.yz');
const element = document.createElement('secret-no-case-conversion');
document.body.append(element);

assert(element.amountOf_changes == 0);

element['my-secret'] = 'foo';

assert(element['my-secret'] == 'foo');
assert(element.amountOf_changes == 1);
