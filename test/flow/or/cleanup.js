const { Flow } = self.yozo;
let cleanup = 0;
const flow = new Flow();
const other = new Flow();
flow.or(other);

other.cleanup(() => cleanup++);

flow.stop();
assert(cleanup == 1);
