const { live } = self.yozo;
const $ = live([23, 5, -1]);
const iterable = [...$];

assert(iterable[0] == $.$0);
assert(live.get(iterable[0]) == 23);
