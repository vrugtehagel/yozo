import { reversible } from './index.js'

export const secret = Symbol('secret')
export const define = name => current.name = name

const inProgress = new Set()
const map = new Map()
let current = null

define[secret] = {}
define[secret].getByUUID = uuid => {
    const definition = map.get(uuid)
    map.delete(uuid)
    return definition
}
define[secret].newContext = () => ({
    name: '',
    observed: [],
    properties: [],
    methods: [],
    form: false,
    exposed: {
        internals: Symbol('internals'),
        attributes: Symbol('attributes'),
        any: Symbol('any'),
        elements: Symbol('elements')
    }
})

define.context = uuid => {
    if(current) return
    inProgress.add(uuid)
    queueMicrotask(() => {
        if(inProgress.has(uuid)) throw Error('Yozo: top level await not allowed in custom element definitions')
    })
    current = define[secret].newContext()
    return current.exposed
}
define.attribute = (name, {type, as} = {}) => {
    current.observed.push(name)
    if(!type && !as) return
    as ??= name.replace(/-+\w/g, match => match.slice(-1).toUpperCase())
    const aliases = Array.isArray(as) ? as : [as]
    for(const alias of aliases) setPropertyFromAttribute(name, type, alias)
}
define.form = () => { current.form = true }
define.property = (name, descriptor) => {
    if(typeof descriptor == 'function') descriptor = {get: descriptor}
    current.properties.push({name, descriptor})
}
define.method = (name, method) => { current.methods.push({name, method}) }
define.construct = fn => { current.construct = fn }
define.connect = fn => { current.connect = reversible(fn) }
define.disconnect = fn => { current.disconnect = fn }

define.done = uuid => {
    if(!current) return
    inProgress.delete(uuid)
    map.set(uuid, current)
    current = null
}

function setPropertyFromAttribute(name, type, as){
    if(type == 'boolean'){
        define.property(as, {
            get(){ return this.hasAttribute(name) },
            set(value){ this.toggleAttribute(name, value) }
        })
    } else if(type == 'number'){
        define.property(as, {
            get(){ return Number(this.getAttribute(name)) },
            set(value){ this.setAttribute(name, value) }
        })
    } else {
        define.property(as, {
            get(){ return this.getAttribute(name) },
            set(value){ this.setAttribute(name, value) }
        })
    }
}
