const { Flow } = self.yozo;
let triggers = 0;
const flow = new Flow();
const other = new Flow();
flow.or(other).then(() => triggers++);

flow.now();
assert(triggers == 1);

other.now();
other.now();
assert(triggers == 3);
