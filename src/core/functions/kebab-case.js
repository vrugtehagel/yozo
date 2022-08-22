export default function kebabCase(string){
    return string.replace(/([A-Z])/g, '-$1')
}
