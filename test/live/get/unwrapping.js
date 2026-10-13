const { live } = globalThis.yozo;
const $ = live({ foo: 23 });

assert(live.get($.$foo) == 23);
