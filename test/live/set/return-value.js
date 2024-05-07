const { live } = self.yozo;

const $ = live({ foo: 23 });
assert(live.set($.$foo, 5) == true);
assert(live.set($.$bar.$baz, 5) == false);
assert(live.set(null, 5) == false);
assert(live.set({}, 5) == false);
