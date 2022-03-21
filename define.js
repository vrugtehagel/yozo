import { reversible } from './index.js'

export { when } from './index.js'
export const secret = Symbol('secret')
export const define = name => current.name = name

const inProgress = new Set()
const map = new Map()
let current = null

define[secret] = {}
define[secret].getByUUID = uuid => {
    const definition = map.get(uuid)
    map.delete(uuid)
    current = null
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
    if(current) throw Error(`Yozo: cannot use top-level await in custom element definition. ${current.name ? `Check "${current.name}", it's probably in there.` : ''}`)
    inProgress.add(uuid)
    current = define[secret].newContext()
    return current.exposed
}
define.attribute = (name, options = {}) => {
    current.observed.push(name)
    if(!options.type) return
    const as = options.as ?? name
        .replace(/-+\w/g, match => match.slice(-1).toUpperCase())
    const aliases = Array.isArray(as) ? as : [as]
    for(const alias of aliases)
        setPropertyFromAttribute(name, {...options, as: alias})
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

define.done = (uuid, error) => {
    if(!current) return
    inProgress.delete(uuid)
    map.set(uuid, current)
    current = null
    if(error) throw error
}

function setPropertyFromAttribute(name, options){
    const {type, as} = options
    if(type == Boolean){
        define.property(as, {
            get(){ return this.hasAttribute(name) },
            set(value){ this.toggleAttribute(name, value) }
        })
    } else {
        define.property(as, {
            get(){
                const value = this.getAttribute(name)
                return value == null
                    ? options.default ?? null
                    : type(value)
            },
            set(value){
                if(value == null) return this.removeAttribute(name)
                this.setAttribute(name, value)
            }
        })
    }
}
