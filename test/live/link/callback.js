const { live } = self.yozo;

const $ = live({ a: 2, b: 3 });
live.link($.$sum, () => $.a + $.b);

assert($.sum == 5);

$.a = 8;
$.b = 15;
assert($.sum == 23);

$.b = 'ball';
assert($.sum == '8ball');
