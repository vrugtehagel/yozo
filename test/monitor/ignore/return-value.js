const { monitor } = globalThis.yozo;

assert(monitor.ignore(() => 23) == 23);
