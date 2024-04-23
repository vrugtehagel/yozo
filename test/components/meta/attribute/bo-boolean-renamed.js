await self.yozo.register('./bo-boolean-renamed.yz');
const element = document.createElement('health-boolean-renamed');
document.body.append(element);

assert(element.isSick == false);
assert(element.sick == undefined);

element.isSick = { foo: 23 };

assert(element.getAttribute('sick') == '');
assert(element.isSick == true);
assert(typeof element.isSick == 'boolean');
