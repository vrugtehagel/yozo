import trackable from '../trackable/index.js'
import define from './define.js'
import watch from '../watch/index.js'
import camelCase from './functions/camel-case.js'
import kebabCase from './functions/kebab-case.js'
import html from './functions/html.js'
import setAttribute from './functions/set-attribute.js'
import error from '../development/error.js'//

define.register(null, function(){
    const constructor = function(secret){
        secret.exposed = {host: this}
    }
    const connectedCallback = function(secret){
        secret.connected = true
    }
    const disconnectedCallback = function(secret){
        secret.connected = false
    }
    return {constructor, connectedCallback, disconnectedCallback}
}, 5)

define.register(null, function(){
    const constructor = function(secret){
        const cache = {}
        const find = selector => secret.root.querySelector(selector)
        const findAll = selector => [...secret.root.querySelectorAll(selector)]
        const get = (target, name) => {
            if(name == 'all') return findAll
            const kebabName = kebabCase(name)
            cache[name] ??= find(`#${kebabName}`) ?? find(kebabName)
            if(name != kebabName) cache[name] ??= find(`#${name}`)
            return cache[name]
        }
        secret.exposed.elements = new Proxy(find, {get})
    }
    return {constructor}
}, 10)

define.register('shadow', function([args]){
    const context = this
    const shadow = args?.[0]
    if(!shadow) return
    context.shadow = shadow
    const constructor = function(secret){
        secret.exposed.shadow = secret.root = this.attachShadow(shadow)
    }
    return {constructor}
}, 15)

define.register('template', function([args]){
    const context = this
    if(!args) return
    context.template = args[0]
    const constructor = function(secret){
        if(secret.root) return secret.root.innerHTML = context.template
        secret.root = html(context.template)
    }
    const connectedCallback = function(secret){
        if(context.shadow) return
        if(secret.didConnect) return
        if(!context.template) return
        this.replaceChildren(secret.root)
        secret.root = this
    }
    return {constructor, connectedCallback}
}, 20)

define.register('style', function([args]){
    if(!args) return
    const context = this
    const sheet = new CSSStyleSheet
    sheet.replace(args[0])
    const constructor = function(secret){
        if(!context.shadow) return
        secret.root.adoptedStyleSheets = [sheet]
    }
    const connectedCallback = function(secret){
        if(context.shadow) return
        const root = this.getRootNode()
        const sheets = root.adoptedStyleSheets
        if(sheets.includes(sheet)) return
        root.adoptedStyleSheets = [...sheets, sheet]
    }
    return {constructor, connectedCallback}
}, 25)

define.register('attribute', function(argslist){
    const context = this
    const {body} = context
    const {prototype} = body
    const names = argslist.map(([name]) => name)
    const descriptor = {get: () => names}
    Object.defineProperty(body, 'observedAttributes', descriptor)
    const copy = Object.fromEntries(names.map(name => [camelCase(name), null]))
    for(const [name, options] of argslist){
        const as = Array.isArray(options.as)
            ? options.as
            : [options.as ?? camelCase(name)]
        const {type} = options
        const isBoolean = type === Boolean
        const get = isBoolean
            ? function(){ return this.hasAttribute(name) }
            : function(){
                const value = this.getAttribute(name)
                return value == null ? options.default ?? null : type(value)
            }
        const set = isBoolean
            ? function(value){ this.toggleAttribute(name, !!value) }
            : function(value){ setAttribute(this, name, value) }
        const descriptor = {get, set, configurable: true}
        for(const alias of as) Object.defineProperty(prototype, alias, descriptor)
    }
    const constructor = function(secret){
        const attributes = watch({...copy})
        secret.exposed.attributes = attributes
        for(const name of names){
            const camelCaseName = camelCase(name)
            attributes[camelCaseName].addEventListener('change', () => {
                if(attributes[camelCaseName].is(this.getAttribute(name))) return
                setAttribute(this, name, attributes[camelCaseName].get())
            })
        }
    }
    const attributeChangedCallback = trackable(function(secret, name, oldValue, value){
        const {attributes} = secret.exposed
        attributes[camelCase(name)] = value
    })
    return {constructor, attributeChangedCallback}
}, 35)

define.register('require', async function(argslist){
    const names = argslist.flat()
    this.requires = names
    await Promise.all(names.map(name => customElements.whenDefined(name)))
}, 40)



define.register('state', function([args]){
    if(args && typeof args[0] != 'function')//
        throw error('define-state-should-be-function')//
    const state = trackable(args?.[0] ?? (() => ({})))
    const constructor = secret => secret.exposed.state = watch(state())
    return {constructor}
}, 50)

define.register('shape', function([args]){
    if(!args) return
    const context = this
    const {prototype} = context.body
    const shape = args[0]
    if(!shape.prototype) throw error('define-shape-needs-class')//
    const descriptors = Object.getOwnPropertyDescriptors(shape.prototype)
    const map = new WeakMap
    for(const [name, descriptor] of Object.entries(descriptors)){
        const additions = descriptor.get || descriptor.set
            ? {get(){ return map.get(this)[name] }, set(value){ return map.get(this)[name] = value }}
            : {value: function(...args){ return map.get(this)[name](...args) }}
        Object.defineProperty(prototype, name, {...descriptor, ...additions})
    }
    const constructor = function(secret){
        const internal = new shape(secret.exposed)
        map.set(this, internal)
        Object.assign(internal, secret.exposed)
    }
    return {constructor}
}, 55)

define.register('construct', function([args]){
    if(!args) return
    if(typeof args[0] != 'function')//
        throw error('define-expect-function', 'construct')//
    const context = this
    const callback = trackable(args[0])
    const constructor = function(secret){
        callback.call(this, {...secret.exposed})
    }
    return {constructor}
}, 60)

define.register('connect', function([args]){
    if(!args) return
    if(typeof args[0] != 'function')//
        throw error('define-expect-function', 'connect')//
    const context = this
    const callback = trackable(args[0])
    const connectedCallback = function(secret){
        secret.didConnect = true
        secret.connect = callback.do.call(this, {...secret.exposed})
    }
    const disconnectedCallback = trackable(secret => secret.connect.undo())
    return {connectedCallback, disconnectedCallback}
}, 65)

define.register('disconnect', function([args]){
    if(!args) return
    if(typeof args[0] != 'function')//
        throw error('define-expect-function', 'disconnect')//
    const context = this
    const callback = trackable(args[0])
    const disconnectedCallback = function(secret){
        callback.call(this, {...secret.exposed})
    }
}, 70)

define.register('update', function(argslist){
    const updaters = argslist.map(args => trackable(args[0]))
    if(updaters.some(updater => typeof updater != 'function'))//
        throw error('define-expect-function', 'update')//
    const constructor = function(secret){
        secret.updateQueue = new Set
        for(const updater of updaters){
            const queue = () => {
                if(secret.connected) queueMicrotask(run)
                else secret.updateQueue.add(run)
            }
            const run = trackable(async () => {
                const call = updater.do.call(this, secret.exposed, queue)
                const controller = new AbortController
                const {signal} = controller
                const variables = [...call.watch]
                await Promise.any(variables.map(variable => when(variable).change({signal})))
                controller.abort()
                call.undo()
                queue()
            })
            queue()
        }
    }
    const connectedCallback = function(secret){
        secret.updateQueue.forEach(run => run())
        secret.updateQueue.clear()
    }
    return {constructor, connectedCallback}
}, 75)
