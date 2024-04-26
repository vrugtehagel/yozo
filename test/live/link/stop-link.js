const { live } = self.yozo;

const $ = live({ a: 2, b: 3 });
const link = live.link($.$sum, () => $.a + $.b);

assert($.sum == 5);

link.stop();

$.a = 8;
assert($.sum == 5);
