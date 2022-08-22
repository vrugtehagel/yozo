import when from '../../when/index.js'

let initializing = true
let canRemoveBaseInstantly = true

const ready = new Promise(async resolve => {
    if(document.readyState != 'loading')
        await when(document).DOMContentLoaded({once: true})
    const example = 'https://example.com/'
    const url = await evalModule('', example)
    canRemoveBaseInstantly = url == example
    resolve()
})

export default async function evalModule(string, baseURL){
    if(!initializing) await ready
    initializing = false
    const uuid = crypto.randomUUID()
    const promise = new Promise(resolve => window[uuid] = resolve)
    const returnValue = initializing ? 'import.meta.url' : ''
    const script = document.createElement('script')
    const base = document.createElement('base')
    script.type = 'module'
    script.textContent = `window["${uuid}"](${returnValue});${string}`
    base.href = baseURL
    document.head.prepend(base, script)
    if(canRemoveBaseInstantly) base.remove()
    const result = await promise
    base.remove()
    script.remove()
    return result
}
