import { monitor, until } from './monitor.js'
import { Flow } from './flow.js'
import { live } from './live.js'
import { when } from './when.js'
import { purify } from './purify.js'
import { effect } from './effect.js'
import { frame, interval, paint, timeout } from './timers.js'
import { register } from './register.js'

import './mods/00-title.js'
import './mods/01-meta.js'
import './mods/02-hooks.js'
import './mods/03-transforms.js'
import './mods/05-template.js'
import './mods/07-query.js'
import './mods/08-style.js'
import './mods/10-script.js'

self.yozo = {
	monitor, until,
	Flow,
	live,
	when,
	purify,
	effect,
	frame, interval, paint, timeout,
}

Object.defineProperty(self.yozo, 'register', {value: register})
