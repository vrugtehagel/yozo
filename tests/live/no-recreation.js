const { live } = self.yozo;
let data = { foo: 23 };

const $data1 = live(data);
const $data2 = live(data);

assert($data1 != $data2);
