const { Flow } = self.yozo;
const flow = new Flow();
const other = new Flow();
let stopped = false;
let otherStopped = false;
other.cleanup(() => otherStopped = true);
flow.until(other).cleanup(() => stopped = true);

assert(!stopped);

other.now();
assert(stopped);
assert(otherStopped);

flow.stop();
other.stop();
