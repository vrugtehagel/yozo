let canRemoveBaseInstantly = true
let testedFunctionality = false

export default async function evalModule(string, baseURL){
    const uuid = crypto.randomUUID()
    const promise = new Promise(resolve => window[uuid] = resolve)
    const returnValue = testedFunctionality ? 'import.meta.url' : ''
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

const example = 'https://example.com/'
const url = evalModule('', example)
canRemoveBaseInstantly = url == example
testedFunctionality = true
