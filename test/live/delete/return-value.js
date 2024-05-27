const { live } = self.yozo;

const object = { foo: 23 };
Object.defineProperty(object, 'qux', { value: 7 });

const $ = live(object);
assert(live.delete($.$foo) == true);
assert(live.delete($) == true);
assert(live.delete($.$qux) == false);
assert(live.delete($.$bar.$baz) == false);
assert(live.delete(null) == false);
assert(live.delete({}) == false);
