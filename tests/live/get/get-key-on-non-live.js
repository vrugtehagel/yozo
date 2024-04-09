const { live } = self.yozo;
const data = { foo: 23 }

assert(live.get(data, 'foo') == 23);
assert(live.get(self.yozo, 'live') == live);
