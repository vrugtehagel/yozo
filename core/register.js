import define from './define.js'
import camelCase from './functions/camel-case.js'
import transform from './functions/transform.js'
import evalModule from './functions/eval-module.js'
import error from '../development/error.js'//

export default async function register(url, {type} = {}){
    const isJS = /\.m?js$/.test(url)
    if(isJS) return await import(url)
    const response = await fetch(url)
    const text = await response.text()
    const script = transform(text)
    if(type == 'module') return await evalModule(script, url)
    else (0, eval)(`{${script}}`)
}

let autoCalled = false
register.auto = find => {
    if(autoCalled) return
    autoCalled = true
    const initiated = new Set
    const registerFrom = root => root.querySelectorAll(':not(:defined)')
        .forEach(({localName}) => autoDefine(localName.toLowerCase()))

    const autoDefine = name => {
        const url = find(name)
        if(!url) return
        if(initiated.has(url)) return
        initiated.add(url)
        register(url)
    }

    define.register(null, function(){
        const context = this
        context.requires.forEach(autoDefine)
        const constructor = function(secret){
            if(!context.shadow) return
            registerFrom(secret.root)
        }
        const connectedCallback = function(secret){
            if(context.shadow) return
            if(secret.didConnect) return
            registerFrom(this)
        }
        return {constructor, connectedCallback}
    }, 45)

    registerFrom(document)
}
