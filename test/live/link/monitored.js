const { live, monitor } = self.yozo;

const $ = live({ a: 2, b: 3 });
const call = monitor(['undo'], () => {
	live.link($.$sum, () => $.a + $.b);
});

$.a = 8;
assert($.sum == 11);

call.undo();

$.b = 15;
assert($.sum == 11);
