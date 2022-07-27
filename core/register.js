import define from './define.js'
import camelCase from './functions/camel-case.js'

export const meta = {}

export default async function register(url){
    const response = await fetch(url)
    let text = await response.text()
    const parser = new DOMParser
    const dom = parser.parseFromString(text, 'text/html')
    const template = dom.querySelector('template')?.innerHTML
    const style = dom.querySelector('style')?.textContent
    const regex = /(import[\s{][^.(]+?from\s*)(['"])([./](?:\\.|[^\2\\])*?)\2/g
    const script = dom.querySelector('script').textContent
    if(!script) //
        throw TypeError('Your Yozo templates must include a <script> tag') //
    const escape = string => string.replace(/([`\\])/g, '\\$1')
    const uuid = crypto.randomUUID()
    const promise = new Promise(resolve => window[uuid] = resolve)
    const element = document.createElement('script')
    element.type = 'module'
    element.textContent = `import{define,when}from"${meta.url}";
const{construct,connect,disconnect,update}=define;
${script};
${template && `define.template(\`${escape(template)}\`);`}
${style && `define.style(\`${escape(style)}\`);`}
window["${uuid}"]()
`
    document.head.append(element)
    await promise
    delete window[uuid]
    element.remove()
}


register.auto = find => {
    const initiated = new Set
    function autoDefineFrom(root){
        root.querySelectorAll(':not(:defined)')
            .forEach(({localName}) => autoDefine(localName))
    }

    function autoDefine(name){
        const url = find(name.toLowerCase())
        if(initiated.has(name)) return
        initiated.add(name)
        if(!url) return
        const isJS = /\.m?js$/.test(url)
        if(isJS) import(url)
        else register(url)
    }

    define.register(null, function(){
        const context = this
        context.requires.forEach(autoDefine)
        const constructor = function(secret){
            if(!context.shadow) return
            autoDefineFrom(secret.root)
        }
        const connectedCallback = function(secret){
            if(context.shadow) return
            if(secret.didConnect) return
            autoDefineFrom(this)
        }
        return {constructor, connectedCallback}
    }, 45)

    autoDefineFrom(document)
}

