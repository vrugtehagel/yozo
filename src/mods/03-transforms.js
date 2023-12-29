import { define } from '../define.js'
import { effect } from '../effect.js'
import { when } from '../when.js'
import { monitor } from '../monitor.js'
import { camelCase } from '../utils.js'
import { error, warn } from '../help.js' //


// Here, we parse the in-template logic and shorthands.

define.register(3, Symbol(), context => {
	// We'll parse the whole template before we even use the element.
	// This guarantees we only do the expensive work once per registration.
	// We use a node iterator to read the whole template
	// We change some bits here and there (specifically, we remove flow control
	// nodes and chop up text nodes) but the idea is that we then create an
	// array of transforms where each subsequent element maps to its respective
	// node in the parsed tree

	// We do that properly, then we can clone the "base" template and iterate it
	// and blindly run the transforms on the cloned nodes
	// The alternative is iterating them simultaneously and looking up the
	// transforms in a node-to-transform map which seems more awkward and complex

	const transformsMap = new Map
	const getTransforms = (root, ...scopeNames) => {
		// we cache the transforms (of course)
		if(transformsMap.get(root)) return transformsMap.get(root)
		const transforms = []
		transformsMap.set(root, transforms)

		// second argument is "whatToShow";
		// 5 is a bitmask for "show elements and text nodes"
		const iterator = document.createNodeIterator(root, 5)
		let node
		while(node = iterator.nextNode()){
			if(node.nodeType == 3){
				// For text nodes, we split it into parts
				// alternating between regular text and {{ interpolation }}
				const parts = node.textContent.split(/{{([^]*?)}}/g)
				node.after(...parts)
				node.remove()

				// We created a bunch of extra text nodes, so now we have to be
				// careful with where the node iterator ends up as well as with
				// the items we push into the transforms array
				// (since they have to map one-by-one to the iterated nodes)
				transforms.push(...parts.map((part, index) => {
					node = iterator.nextNode()
					if(index % 2 == 0) return
					const getter = new Function(...scopeNames, `return(${node.textContent})`)
					return (meta, clone, scopes) => meta.x.connected(() => effect(() =>
						clone.textContent = getter(...scopes.map(scope => scope[1]))
					))
				}))
			} else if(node.getAttribute('#for')){
				// We only support #for…of, things will break without the " of "
				if(!node.getAttribute('#for').includes(' of ')) //
					error`transform-for-without-of` //

				// For simplicity, we only do #for…of expressions (not #for…;…;…).
				// We replace the #for element from the template with an "anchor node",
				// i.e. an empty text node.
				// This node exists as a placeholder for the node iterator to land on.


				const [scopeName, expression] = node.getAttribute('#for').split(' of ')
				node.before('')
				node.removeAttribute('#for')
				node.remove()
				const element = node
				const getter = new Function(...scopeNames, `return(${expression})`)
				transforms.push((meta, clone, scopes) => {
					// the cloned node is just the anchor node,
					// we only use it as an insertion point reference

					// We also cache the items in the computed iterable
					// along with their rendered subtrees.
					// That lets us avoid re-rendering the whole #for every single
					// time something changes in the iterable expression

					// Array<[Item, RenderedNode[]]>
					const cache = []
					meta.x.connected(() => effect(() => {
						const array =
							true ? (() => { //
								const value = getter.call(node, ...scopes.map(scope => scope[1])) //
								if(typeof value[Symbol.iterator] == 'function') return [...value] //
								error`transform-for-${expression}-not-iterable` //
							})() : //
							[...getter.call(node, ...scopes.map(scope => scope[1]))]
						while(cache.length > array.length)
							cache.pop()[1].undo()
						array.map((item, index) => {
							// If the item we get in the iterable is the same,
							// Then leave the already-rendered nodes alone
							if(cache[index] && cache[index][0] === item) return
							const call = monitor(['undo'], () => {
								const rendered = meta.__render(element, [...scopes, [scopeName, item]])
								const nodes = rendered.nodeType == 11 ? rendered.childNodes : [rendered]
								monitor.add('undo', () => nodes.map(node => node.remove()))
								;(cache[index - 1]?.[1].result.at(-1) ?? clone).after(...nodes)
								return nodes
							})
							cache[index]?.[1]()
							cache[index] = [item, call]
						})
					}))
				})

			} else if(node.getAttribute('#if')){
				// This time, the parsing needs to get rid of not just the #if
				// but also the #else-if and the #else, and they may or may not exist
				// Like #for, we replace all of them with a single anchor "" node
				node.before('')
				const anchor = node.previousSibling

				// We keep track of the expressions (basically just the attribute values)
				// and element chain (just the elements without their #-attribute)
				const expressions = []
				const chain = []

				// Consume any #if, #else-if or #else. Return true if something was found.
				const consume = attribute => {
					const element = anchor.nextElementSibling
					if(!element?.hasAttribute(attribute)) return
					expressions.push(`()=>(${element.getAttribute(attribute) || true})`)
					chain.push(element.localName == 'template' ? element.content : element)
					element.removeAttribute(attribute)
					element.remove()
					return true
				}
				consume('#if')
				while(consume('#else-if'));
				consume('#else')

				// We keep track of which item in the chain is rendered
				// That way, if something changes, but the same index ends up being
				// chosen, then we don't need to do anything
				const getter = new Function(...scopeNames, `return[${expressions}].findIndex(e=>e())`)
				transforms.push((meta, clone, scopes) => {
					let connectedIndex
					const connected = []
					meta.x.connected(() => effect(() => {
						const index = getter.call(null, ...scopes.map(scope => scope[1]))
						if(index == connectedIndex) return
						connectedIndex = index
						connected.splice(0).map(node => node.remove())
						// Basically just index == -1, i.e. none of the statements match
						if(!chain[index]) return
						const rendered = meta.__render(chain[index], scopes)
						const nodes = rendered.nodeType == 11 ? rendered.childNodes : [rendered]
						connected.push(...nodes)
						clone.after(...nodes)
					}))
				})
			} else {

				// First, we check that the left-over attributes make sense

				const looseElse = [...node.attributes] //
					.find(({name}) => ['#else-if', '#else'].includes(name))?.name //
				if(looseElse) warn`transform-if-found-loose-${looseElse}` //

				if(node.hasAttribute('#elseif')) //
					warn`transform-elseif-instead-of-else-if` //

				const looseFlowControl = [...node.attributes] //
					.find(({name}) => name.startsWith('#'))?.name //
				if(looseFlowControl) //
					warn`transform-loose-flow-control-${looseFlowControl}` //

				const usesClassList = [...node.attributes] //
					.some(({name}) => name.startsWith('.class-list')) //
				if(node.hasAttribute(':class') && usesClassList) //
					warn`transform-mixing-class-and-class-list` //

				// Now we know the node is a non-flow control element
				// That means we can start parsing the attributes!
				// But, we need to bundle them all in a single transform item
				// because again, the transform array items need to map one-to-one
				// onto the nodes
				const shorthands = [...node.attributes].map(attribute => {
					if(attribute.name[0] == ':'){
						// First, dynamic attributes
						const name = attribute.name.slice(1)
						const getter = new Function(...scopeNames, `return(${attribute.value})`)
						node.removeAttribute(attribute.name)
						return (meta, clone, scopes) => meta.x.connected(() => effect(() => {
							const value = getter.call(clone, ...scopes.map(scope => scope[1]))
							if(value == null) clone.removeAttribute(name)
							else clone.setAttribute(name, value)
						}))
					} else if(attribute.name[0] == '.'){
						// Property attributes. We allow for things such as
						//	.parent-node.style.box-shadow="…"
						// So we chop it up at the periods and see what we get
						const last = attribute.name.slice(1).split('.').at(-1)
						const chain = attribute.name.slice(1).split('.').map(camelCase)
						const getter = new Function(...scopeNames, `return(${attribute.value})`)
						node.removeAttribute(attribute.name)
						return (meta, clone, scopes) => meta.x.connected(() => effect(() => {
							const value = getter.call(clone, ...scopes.map(scope => scope[1]))
							const properties = [...chain]
							const tail = properties.pop()
							let current = clone
							properties.map(property => current = current?.[property])
							if(current == null) return
							// Special behavior for DOMTokenList objects (basically, just
							// for the class and part attributes).
							// With this, we can do .class-list.foo-bar="true" to manage
							// individual class names
							if(current instanceof DOMTokenList) current.toggle(last, value)
							else current[tail] = value
						}))
					} else if(attribute.name[0] == '@'){
						const type = attribute.name.slice(1)
						const handler = new Function(...scopeNames, 'event', attribute.value)
						node.removeAttribute(attribute.name)
						return (meta, clone, scopes) => meta.x.connected(() => {
							when(clone).does(type).then(event => monitor.ignore(() => {
								// Maybe I should bake the monitor.ignore into flow callbacks?
								handler.call(clone, ...scopes.map(scope => scope[1]), event)
							}))
						})
					}
				})
				transforms.push((...args) => {
					shorthands.map(shorthand => shorthand?.(...args))
				})
			}
		}
		return transforms
	}

	// Now on a per-instance level, we can actually render stuff
	const constructor = function(meta){
		meta.__render = (tree, scopes) => {
			const transforms = getTransforms(tree, ...scopes.map(scope => scope[0]))
			// To render a parsed tree, we first get the array of transforms
			// That's cached, so this work happens once per component registration
			// Then, we iterate the tree, and transforms map one-to-one onto the
			// items from the node iterator
			const clone = tree.cloneNode(true)
			const iterator = document.createNodeIterator(clone, 5)
			transforms.map(transform => {
				const node = iterator.nextNode()
				transform?.(meta, node, scopes)
			})
			return clone
		}
	}
	return {constructor}
})