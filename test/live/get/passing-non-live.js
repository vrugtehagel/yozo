const { live } = self.yozo;

assert(live.get(null) == null);
assert(live.get(23) == 23);
assert(live.get(self) == self);
