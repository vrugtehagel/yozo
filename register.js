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
    const mode = template.getAttribute('mode') ?? 'open'
    const delegatesFocus = template.hasAttribute('delegates-focus')
    const sheet = style ? new CSSStyleSheet : null
    const elementCache = new Map()
    const attributeTargets = new Map()
    const definition = await run(script.textContent)
    const {exposed, observed, form} = definition
    const {internals, attributes, any, elements} = exposed

    sheet?.replace(style.textContent)
    template.removeAttribute('mode')
    template.removeAttribute('delegates-focus')

    const body = class extends HTMLElement {
        #call = null
        ;[attributes] = (...names) => {
            const target = new EventTarget
            attributeTargets.set(names, target)
            return target
        }
        ;[elements] = Object.assign(
            selector => this[internals].shadowRoot.querySelector(selector),
            {all: selector => [...this[internals].shadowRoot.querySelectorAll(selector)]}
        )

        constructor(){
            super()
            const shadow = this.attachShadow({mode, delegatesFocus})
            shadow.append(template.content.cloneNode(true))
            if(sheet) shadow.adoptedStyleSheets = [sheet]
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
            if(oldValue === value) return
            const detail = {attribute, oldValue, value}
            const getEvent = () => new CustomEvent('change', {detail})
            for(const [names, target] of attributeTargets)
                if(names.includes('*') || names.includes(attribute))
                    target.dispatchEvent(getEvent())
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

    Object.defineProperty(body, 'formAssociated', {get: () => form})
    Object.defineProperty(body, 'observedAttributes', {get: () => observed})

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
