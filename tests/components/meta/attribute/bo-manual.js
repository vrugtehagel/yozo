await self.yozo.register(`./bo-manual.yz`);
const element = document.createElement('birthday-manual');
document.body.append(element);

assert(typeof element.dateOfBirth == 'object');

element.setAttribute('dateofbirth', '06/28/1996');
assert(Number(element.dateOfBirth) == 835912800000);

element.dateOfBirth = new Date('March 2, 2000');
assert(element.getAttribute('dateofbirth') == 'Thu Mar 02 2000');
