(() => {
	const {when} = self.yozo

	when(self).installs().then(() => self.skipWaiting())
	when(self).activates().then(() => self.clients.claim())
	when(self).messages().then(event => {
		if(event.data.type !== 'forceactivate') return
		self.clients.claim()
	})
})()
