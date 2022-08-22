import './core/registrations.js'

import define from './core/define.js'
import register from './core/register.js'
import html from './core/functions/html.js'

import trackable from './trackable/index.js'

import watch from './watch/index.js'

import when from './when/index.js'
import timeout from './when/functions/timeout.js'
import interval from './when/functions/interval.js'
import frame from './when/functions/frame.js'
import paint from './when/functions/paint.js'

self.yozo = {
    define,
    register,
    html,
    trackable,
    watch,
    when,
    timeout,
    interval,
    frame,
    paint
}
