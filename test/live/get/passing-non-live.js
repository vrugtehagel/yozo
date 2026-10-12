const { live } = globalThis.yozo;

assert(live.get(null) == null);
assert(live.get(23) == 23);
assert(live.get(globalThis) == globalThis);
