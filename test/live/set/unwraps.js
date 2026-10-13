const { live } = globalThis.yozo;

const $ = live({ foo: 23 });
live.set($.$bar, $.$foo);

assert($.bar == 23);
