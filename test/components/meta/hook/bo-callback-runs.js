await self.yozo.register('./bo-callback-runs.yz');
const element = document.createElement('reset-counter-callback-runs');
const form1 = document.createElement('form');
const form2 = document.createElement('form');
document.body.append(form1, form2);

assert(element.value == -1);

form1.append(element);
assert(element.value == 0);

form1.reset();
form1.reset();
assert(element.value == 2);

form2.append(element);
assert(element.value == 0);

form2.reset();
assert(element.value == 1);
