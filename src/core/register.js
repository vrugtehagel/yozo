import define from './define.js'
import camelCase from './functions/camel-case.js'
import isJS from './functions/is-js.js'
import evalModule from './functions/eval-module.js'
import fetchCode from './functions/fetch-code.js'
import error from '../development/error.js'//

export default async function register(url){
    if(isJS(url)) return void await import(url)
    const code = await fetchCode(url)
    await evalModule(code, url)
}

register.sync = async url => {
    const code = await fetchCode(url)
    ;(0, eval)(code)
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
