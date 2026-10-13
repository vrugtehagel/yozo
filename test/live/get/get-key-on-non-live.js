const { live } = globalThis.yozo;
const data = { foo: 23 };

assert(live.get(data, 'foo') == 23);
assert(live.get(globalThis.yozo, 'live') == live);
