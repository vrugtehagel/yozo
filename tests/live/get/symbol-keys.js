const { live } = self.yozo;
const symbol = Symbol();
const $ = live({ [symbol]: 7 });

assert(live.get($, symbol) == 7);
