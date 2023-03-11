import camelCase from '../camel-case.js'
import goodies from '../define/goodies.js'

const importRegex = /^\s*import\b[^.('"]+\bfrom\s*(['"])[^'"]*\1;?/
const escapeRegex = /[`$]/g


export default function transpile(input){
	const add = `n${crypto.randomUUID().slice(-10)}`
	let isModule
	let result = `\nself.yozo.define(${add}=>{const {html,track,watch,when,timeout,interval,frame}=self.yozo`
	for(const element of html(`<template>${input}</template>`).content.children){
		const attributes = [...element.attributes].map(attribute => {
			if(element.localName == 'meta' && element.attributes.attribute && attribute.name == 'type')
				return `type:${attribute.value}`
			return `${camelCase(attribute.name)}:\`${attribute.value}\``
		})

		let content = element.innerHTML
		if(element.localName == 'script'){
			isModule ||= element.type == 'module'
			let match
			while(match = content.match(importRegex)){
				result = `${match[0]}${result}`
				content = content.slice(match[0].length)
			}
			content = `function({${goodies.exposed}},{${goodies.hooks}}){${content}}`
		} else {
			content = `\`${content.replace(escapeRegex, '\\$&')}\``
		}
		result += `\n${add}.${camelCase(element.localName)}?.({${attributes}},${content});`
	}
	result += '\n})'
	return [result, isModule]
}
