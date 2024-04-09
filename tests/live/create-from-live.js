const { live } = self.yozo;
const $ = live({ foo: 23 });
const $number = live($.$foo);

assert(yozo.live.get($number) == 23);
