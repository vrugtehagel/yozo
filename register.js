import { define, secret } from './define.js'

const registered = new Set()
export default async function register(url, {as} = {}){
    if(registered.has(url.toString())) return
    const response = await fetch(url)
    const text = await response.text()
    const parser = new DOMParser()
    const dom = parser.parseFromString(text, 'text/html')
    const template = dom.querySelector('template')
    const script = dom.querySelector('script')
    const style = dom.querySelector('style')
    const mode = template.getAttribute('shadow') ?? 'closed'
    const sheet = new CSSStyleSheet
    const elementCache = new Map()
    const definition = await run(script.textContent)
    const {exposed} = definition
    const {internals, attributes, any, elements} = exposed

    sheet.replace(style.textContent)
    template.removeAttribute('shadow')

    const body = class extends HTMLElement {
        #call = null
        ;[attributes] = Object.assign(Object.fromEntries(
            definition.observed.map(attribute => [attribute, new EventTarget])
        ), {[any]: new EventTarget})
        ;[elements] = new Proxy(selector => {
            return this[internals].shadowRoot.querySelector(selector)
        }, {get: (source, property) => {
            const shadow = this[internals].shadowRoot
            if(property == 'all')
                return selector => shadow.querySelectorAll(selector)
            if(!elementCache.has(property)){
                const id = property.replace(/[A-Z]/g, '-$1').toLowerCase()
                elementCache.set(property, shadow.getElementById(id))
            }
            return elementCache.get(property)
        }})

        constructor(){
            super()
            const shadow = this.attachShadow({mode})
            shadow.append(template.content.cloneNode(true))
            shadow.adoptedStyleSheets = [sheet]
            this[internals] = this.attachInternals()
            definition.construct?.call(this, this)
        }

        connectedCallback(){
            this.#call?.undo()
            if(!definition.connect) return
            this.#call = definition.connect.do.call(this, this)
        }

        disconnectedCallback(){
            this.#call.undo()
            definition.disconnect?.()
        }

        attributeChangedCallback(attribute, oldValue, value){
            const detail = {attribute, oldValue, value}
            const getEvent = () => new CustomEvent('change', {detail})
            this[attributes][attribute].dispatchEvent(getEvent())
            this[attributes][any].dispatchEvent(getEvent())
        }
    }

    const writable = true
    const configurable = true
    const attach = (name, descriptor) =>
        Object.defineProperty(body.prototype, name, descriptor)

    for(const {name, method} of definition.methods)
        attach(name, {writable, configurable, value: method})
    for(const {name, descriptor} of definition.properties)
        attach(name, descriptor)

    Object.defineProperty(body, 'formAssociated', {
        get: () => definition.form
    })
    Object.defineProperty(body, 'observedAttributes', {
        get: () => definition.observed
    })

    customElements.define(as ?? definition.name, body)

}


async function run(code){
    const uuid = crypto.randomUUID()
    const getURL = file => new URL(file, import.meta.url)
    const blob = new Blob([
        `import { define } from "${getURL('./define.js')}";\n` + 
        `import { when } from "${getURL('./index.js')}";\n` + 
        `const { internals, attributes, any, elements } = define.context("${uuid}");\n` +
        `const { construct, connect, disconnect } = define;\n` +
        code +
        `\ndefine.done("${uuid}");\n`
    ], {type: 'application/javascript'})
    const objectURL = URL.createObjectURL(blob)
    await import(objectURL)
    URL.revokeObjectURL(objectURL)
    return define[secret].getByUUID(uuid)
}
