export default function setAttribute(element, name, value){
    if(value == null) element.removeAttribute(name)
    else element.setAttribute(name, value)
}
