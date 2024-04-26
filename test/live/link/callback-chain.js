const { live } = self.yozo;

const $ = live({ name: 'Sam' });
live.link($.$capitalized, () => $.name.toUpperCase());
live.link($.$greeting, () => `Hello ${$.capitalized}`);

assert($.greeting == 'Hello SAM');

$.name = 'Alex';
assert($.greeting == 'Hello ALEX');
