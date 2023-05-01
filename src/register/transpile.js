import { camelCase } from '../convert-case.js'
import { goodies } from '../define/goodies.js'


export const transpile = input => {
	const add = `n${crypto.randomUUID().slice(-10)}`
	let result = `\nawait self.yozo.define(${add}=>{const {${Object.keys(self.yozo)}}=self.yozo;`
	for(const element of html(`<template>${input}</template>`).content.children){
		const attributes = [...element.attributes].map(attribute => {
			if(element.localName == 'meta' && element.attributes.attribute && attribute.name == 'type')
				return `type:${attribute.value}`
			return `${camelCase(attribute.name)}:\`${attribute.value}\``
		})
		const content = element.localName == 'script'
			? `function({${goodies.exposed}},{${goodies.hooks}}){${element.innerHTML}}`
			: `\`${element.innerHTML.replace(/[`$]/g, '\\$&')}\``
		result += `\n${add}.${camelCase(element.localName)}?.({${attributes}},${content});`
	}
	result += '\n})'
	return result
}
