import { define, secret } from './define.js'

const registered = new Set()
let done
const pending = new Set()
const setDefined = root => {
    if(!root) return
    for(const {localName} of root.querySelectorAll(':not(:defined)')){
        const promise = customElements.whenDefined(localName).then(() => {
            pending.delete(promise)
            if(pending.size == 0) done()
        })
        pending.add(promise)
    }
}
setDefined(document)
register.done = new Promise(resolve => done = resolve)
export default async function register(url, {as} = {}){
    if(registered.has(url.toString())) return
    const response = await fetch(url)
    const text = await response.text()
    const parser = new DOMParser()
    const dom = parser.parseFromString(text, 'text/html')
    const template = dom.querySelector('template')
    const script = dom.querySelector('script')
    const style = dom.querySelector('style')
    const sheet = style ? new CSSStyleSheet : null
    const elementCache = new Map()
    const attributeTargets = new Map()
    const definition = await run(script.textContent)
    if(!definition) return
    const {exposed, observed, form, options} = definition
    const {internals, attributes, any, elements} = exposed
    as ??= definition.name

    const is = options.extends
    const parent = is
        ? document.createElement(is).constructor
        : HTMLElement
    if(!(is || 'shadow' in definition))
        definition.shadow = {mode: 'open'}
    sheet?.replace(style.textContent)

    const body = class extends parent {
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
            let templateRoot, styleRoot
            if(definition.shadow){
                const shadow = this.attachShadow(definition.shadow)
                templateRoot = shadow
                styleRoot = shadow
            } else {
                templateRoot = this
                styleRoot = document
            }

            if(sheet) styleRoot.adoptedStyleSheets = [...styleRoot.adoptedStyleSheets, sheet]
            if(template) templateRoot.append(template.content.cloneNode(true))
            if(!is) this[internals] = this.attachInternals()
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

    customElements.define(as, body, options)
    setDefined(template?.content)
}

async function run(code){
    const uuid = crypto.randomUUID()
    const type = 'application/javascript'
    const blob = new Blob([getWrapper(code, uuid)], {type})
    const objectURL = URL.createObjectURL(blob)
    let error
    await import(objectURL)
        .catch(message => error = message)
    URL.revokeObjectURL(objectURL)
    const definition = define[secret].getByUUID(uuid)
    if(error) throw error
    return definition
}

const getWrapper = (code, uuid) =>
`import { define, when } from "${define[secret].url}";
const { internals, attributes, any, elements } = define.context('${uuid}');
const { construct, connect, disconnect } = define;

${code}

define.done('${uuid}');
`
