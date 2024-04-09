const { live } = self.yozo;
const $ = live({ foo: 23 });

let changes = 0;
$.$bar.$baz.addEventListener('change', () => changes++);

assert($.$bar.baz == undefined);

$.bar = { baz: 'qux' };

assert(changes == 1);
