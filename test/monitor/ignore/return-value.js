const { monitor } = self.yozo;

assert(monitor.ignore(() => 23) == 23);
