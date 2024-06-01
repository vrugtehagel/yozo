const { purify } = self.yozo;

let returnValue = 23;
const purified = purify(() => returnValue);

assert(purified() == 23);

returnValue = 10;
assert(purified() == 10);
