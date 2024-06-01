const { purify } = self.yozo;

const purified = purify((...args) => args);
const result = purified('a', 'b', 'c');
assert(result.length == 3);
assert(result[0] == 'a');
assert(result[1] == 'b');
assert(result[2] == 'c');
