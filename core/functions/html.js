export default function html(thing, ...args){
    if(typeof thing != 'string') thing = String.raw(thing, ...args)
    const template = document.createElement('template')
    template.innerHTML = thing
    return template.content
}
