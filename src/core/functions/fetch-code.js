import isJS from './is-js.js'
import transform from './transform.js'

export default async function fetchCode(url){
    const response = await fetch(url)
    if(!response.ok) return
    const text = await response.text()
    return isJS(url) ? text : transform(text)
}
