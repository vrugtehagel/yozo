const { live } = self.yozo;
const $ = live({ foo: 23, $bar: 'baz' });

assert(live.get($, 'foo') == 23);
assert(live.get($, '$foo') == undefined);
assert(live.get($, 'bar') == undefined);
assert(live.get($, '$bar') == 'baz');
