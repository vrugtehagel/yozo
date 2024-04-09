const { live } = self.yozo;
const $ = live({ foo: 23 });
const $number = live(24);

$.foo = $number;

assert($.foo == 24);
