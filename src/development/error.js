import errors from './errors.json' assert {type: 'json'}

export default function error(name, ...args){
    const {text, type} = errors[name]
    const message = text.replaceAll(/\$(\d+)/g, (match, index) => args[index]) + '\n'
    const error = window[type](message)
    return error
}
