const { Flow } = self.yozo;
let triggers = 0;
const flow = new Flow();
const other = new Flow();
flow.or(other).then(() => triggers++);

other.stop();

flow.now();
other.now();
assert(triggers == 1);
