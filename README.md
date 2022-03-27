# Yozo

A small library enabling you to write high-quality, robust custom elements quickly and easily.

Yozo leverages custom elements and shadow DOM to achieve simple, encapsulated component-based front-end architectures. On top of allowing you to write single-file components with friendly API's, it provides access to a [`reversibles`](https://github.com/vrugtehagel/reversibles) as well, which it uses internally, so you can get the most bang from your buck.

Consider using [`stateify`](https://github.com/vrugtehagel/stateify) as well! It's specifically designed to have great synergy with Yozo, and provides you with a powerful yet simple to understand way to do state management.

Not familiar with custom elements and/or shadow DOM? MDN has some great articles on the subjects; I recommend you read up on these two topics before using Yozo. [This article](https://developer.mozilla.org/en-US/docs/Web/Web_Components) covers most of it.

- [Installation](#installation)
- [What do you get?](#what-do-you-get)
  * [`register`](#register)
  * [`reversible`, `until`](#reversibles)
  * [`when`](#when)
  * [`define` (!)](#exports-define)
- [In custom element definitions](#in-custom-element-definitions)
  * [`<template>`](#template)
  * [`<script>`](#script)
    * [`define`](#define)
    * [`define.attribute`](#define-attribute)
    * [`define.method`](#define-method)
    * [`define.property`](#define-property)
    * [`define.form`](#define-form)
    * [`construct`](#construct)
    * [`connect`](#connect)
    * [`disconnect`](#disconnect)
    * [`[attributes]`](#symbol-attributes)
    * [`[elements]`](#symbol-elements)
    * [`[internals]`](#symbol-internals)
  * [`<style>`](#style)


<a name="installation"></a>
## Installation

No installation is required! No configuration nonsense, just a simple
```js
import { /* ... */ } from 'https://deno.land/x/yozo'
```
and you're good to go! You can also specify Yozo in your importmap, so you can simply import from `'yozo'` directly.

Note: you don't have to use deno for this to work!

<a name="what-do-you-get"></a>
## What do you get?

Now, what does Yozo actually get you? Well, the package itself only exports a handful of things. The big one is `register`; that allows you to define your custom elements.

<a name="register"></a>
### `register`

This function takes one or two arguments. The first is a URL (either a string or URL object), pointing to your custom element's definition. The second is an optional options object. It may contain an `as` key, with a custom element name as value, that the component will be registered as. This has a higher precedence than the name defined in the custom element's definition! This is mostly useful for renaming third-party components. Your registration will look more-or-less like this:
```js
import { register } from 'https://deno.land/x/yozo'

register('./path/to/custom-dropdown.yz')
register('https://example.com/custom-elements/toggle-switch.yz', {as: 'custom-switch'})
```
Note that importing the same URL multiple times, even with different options objects, doesn't register an element multiple times. A custom element will be registered only once. If you really need to define multiple custom elements with identical definitions, simply append some query parameters to the file URL.

<a name="reversibles"></a>
### `reversible`, `until`

Available as a standalone package as well, see [reversibles](https://github.com/vrugtehagel/reversibles).

<a name="when"></a>
### `when`

A function from the library provided by `reversibles`, see [when](https://github.com/vrugtehagel/reversibles/tree/main/library/when).

<a name="exports-define"></a>
### `define` (!)

**NOT INTENDED FOR DIRECT USE.** This is a function intended to be imported in the custom element definitions. Yozo already imports this into your definitions automatically, so you should never have to use this. Using it may result in errors.

<a name="in-custom-element-definitions"></a>
## In custom element definitions

The files you register with the `register` function are single-file custom element definitions. They contain the HTML, the logic and the styles needed for a single custom element. The file extension, while Yozo recommends `.yz`, really does not matter. A good alternative is just `.html`, since the custom element definitions are valid HTML, and so syntax highlighting will work out of the box. However, they're not valid HTML documents (just a part of a document), and really, they don't make a whole lot of sense without Yozo, so making a distinction may be desirable. Anyway, your file will look roughly like
```html
<template>
    <!-- your HTML -->
</template>
<script>
    // your JavaScript
</script>
<style>
    /* your CSS */
</style>
```

<a name="template"></a>
### `<template>`

The contents of your template will end up in the shadow DOM of the custom element. This means you can leverage everything that vanilla custom elements provide you - `<slot>`s, `part`s, simple classes and ids without having to worry about clashes, etcetera. A template is not required; if not provided, a shadow root will still be created, but it will be empty.

<a name="script"></a>
### `<script>`

The script tag is where the magic happens. The code you write here is a JavaScript module, which means you can `import` things. Yozo provides a few "globals" for you to use - essentially, these are variables that are always available to you in the context of a custom element definition, but they're not actually on the `window`. They are being imported the same way you could import stuff, but you don't actually have to write the import statement. Also, while you can normally use top-level `await` expressions in modules, this is not allowed in custom element definitions.

<a name="define"></a>
#### `define`

You can call `define` as a function to provide a default custom element name. These may be overwritten using the options in the `register` function, but if you're writing the components for use in your own project, you will probably want to name them this way. For example:
```html
<script>
    define('custom-dropdown')
</script>
```
You can also define customized built-in elements this way, with the second, optional argument to `define`. You may pass an object with an `extends` key, which will be passed as third argument to `customElements.define`. There are a few key differences in how Yozo behaves when defining customized built-in elements. In particular, it will not attach a shadow root by default anymore, since most built-in elements don't allow it. The lack of a shadow root has a few implications, see [`define.shadow`](#define-shadow) for more details.

<a name="define-shadow"></a>
#### `define.shadow`

This allows you to customize what type of shadow root you'd like. By default, Yozo will call `attachShadow({mode: 'open'})` (unless defining a customized built-in element), but you may overwrite this by calling `define.shadow` with the same options argument as you'd be passing to `attachShadow`. For example,
```html
<script>
    define('my-form-element')
    define.shadow({mode: 'closed', delegatesFocus: true})
</script>
```
If you don't want a shadow, you may call `define.shadow(null)` (or anything falsey). If you specify that you don't want a shadow root, or you're defining a customized built-in element without a shadow root, then the template's content will be appended to the element itself. The styles, if defined, will go into the global scope.

<a name="define-attribute"></a>
#### `define.attribute`

Defining, keeping track of, and creating properties for attributes was a bit of a hassle for vanilla custom elements. Yozo makes this easy. You can register attributes to be "observed attributes" by calling e.g. `define.attribute('serial-number')`. Then, you can use `this[attributes]('serial-number)` to listen to changes in the attribute - see the section on `[attributes]` for more info on this. This is not where it ends though; `define.attribute` can take a second argument, an options object, that can take a `type`, an `as`, and a `default` key.

The `type` key allows you to specify the type of data the attribute will take. Yozo will then automatically create an accompanying property. The `type` should be provided as a function, which will get the attribute's value as a string and will process the value to be returned by the property getter. Most often you'll want to use something like `Number` or `Boolean` - the constructors are great for converting strings to their primitive equivalents. The value `Boolean` is treated a bit differently - this will turn the attribute in a boolean one. That is to say, the value of the attribute depends on its presence or absence rather than its value. Its usage looks something like this:
```html
<script>
    define('shop-product')
    define.attribute('serial-number', {type: Number})
    define.attribute('has-promo', {type: Boolean})
</script>
```
The above example will allow you to get and set the attributes using the `.serialNumber` and the `.hasPromo` property respectively. Note that the property for the attribute is converted to camelCase, since that's the most sensible default.

If that default property name doesn't suit your needs though, don't worry - the `as` key allows you to rename the property. If, for example, you `define.attribute('serial-number', {type: 'number'})`, but you want to get and set this attribute with the `.serialnr` property rather than the `.serialNumber` property, you can specifiy `as: 'serialnr'` and Yozo will instead use that to define the property. You may also use an array of properties, so you could have both the `.serialNumber` as well as the `.serialnr` properties at the same time for the same `serial-number` attribute.

The `default` key lets you specify a value for when the attribute is absent. If you leave this out, the default is `null` (which is what `getAttribute` returns for attributes that don't exist). Often, when you use e.g. a string or number-type attribute, you'll want to specify this so that the property always has a value according to the type you defined. For example, `define('serial-number', {type: Number, default: 0})`.

For more complex getters and setters for attributes, use `define.property` instead.

<a name="define-method"></a>
#### `define.method`

With both the lifecycle callbacks as well as the introduction of private methods, vanilla custom element definitions can become hard to oversee. What are the methods exposed to the outside worlds, and what are the methods intended for internal logic? Yozo makes this a bit clearer. You define your methods explicitly by calling `define.method`. It takes a string or symbol as first argument (the name of the method), and a function (the method itself) as second argument. Something like so:
```html
<script>
    define('rocket-ship')
    define.method('launch', function(){
        if(this.fuel < 23) throw Error('Not enough fuel!')
        this.startEngines()
    })
</script>
```
Be mindful to not use arrow functions in these definitions; they're methods, and so they'll probably need the `this` value (referring to the custom element itself). When using arrow functions, you will not have access to `this`.

<a name="define-property"></a>
#### `define.property`

This function is very similar to `define.method`, but instead of methods, it allows you to define properties. The first argument it takes is the property name (either a string or a symbol) and the second argument may be either a function, if it is just a getter, or a complete descriptor object a la [`Object.defineProperty`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). Like with `define.method`, make sure to not use arrow functions if you need access to the custom element instance:
```html
<script>
    define('todo-list')
    define.property('length', function(){
        return this.getItems().length
    })
    let allowReadSecrets
    define.property('allowReadSecrets', {
        enumerable: false,
        get(){
            return allowReadSecrets
        },
        set(value){
            if(!this.isAdmin()) return
            allowReadSecrets = value
        }
    })
</script>
```

<a name="define-form"></a>
#### `define.form`

Custom elements may be form-associated, and this function allows you to specify this. Simply call it once, with no arguments, to opt-in to this behavior. Then, you can use `this[internals]` to e.g. set the underlying value for use in `<form>` elements. See the section on `[internals]` for more info.

<a name="construct"></a>
#### `construct`

This is analogous to the constructor for custom elements. With Yozo though, you don't need to call `super()`, attach your shadow DOM and template, or your CSS; Yozo does all of that for you, so that you can focus on the logic. Here, set up everything that needs to be alive for the entire duration of the component, whether connected to the document or not. For example, loading some data into the component, or setting up some of the internal state for the component.

<a name="connect"></a>
#### `connect`

This is equivalent to the `connectedCallback` in custom elements. However, Yozo will automatically make the function your provide here a reversible - that means that you can just set up your component using reversible functions such as `when`, and Yozo will automatically take everything down for you when the element disconnects, so that you don't have to define a `disconnect` callback at all. For example:
```html
<script>
    define('button-clicker')
    define.method('triggerClick', function(){
        this[elements].button.click()
    })

    connect(() => {
        when(this[elements].button).does('click').then(() => {
            console.log('clicked')
        })
    })
</script>
```
Yozo will automatically detach the event listener when the element disconnects from the DOM, and set it back up once the element reconnects. Calling `triggerClick` when the element is detached will therefore do nothing, but when it is connected, it will log `clicked` to the console.

Note that you should use `function(){}` over arrow functions if you want the `this` keyword to be available (and you probably want that) - though, you _can_ use array functions if you want to, as Yozo provides the `this` value as first argument. This means you can use `connect(instance => { console.log(instance) })` as well as `connect(function(){ console.log(this) })`.

<a name="disconnect"></a>
#### `disconnect`

Generally, you won't (shouldn't) need this. `connect` should automatically take everything down. Howver, if you want to, you may use this callback to take some things down manually. Note that you may be better off by writing a generic reversible helper so you can use it in other components as well without the mental overhead of a `disconnect` callback.

<a name="symbol-attributes"></a>
#### `[attributes]`

Yozo provides a few key things to you in the form of symbols, so that they are still shielded from the outside. The `[attributes]` symbol exposes event targets for the attributes you registered. They will fire the `change` event whenever that attribute changes. For example:
```html
<script>
    define('custom-checkbox')
    define.attribute('checked', {type: 'boolean'})

    construct(function(){
        when(this[attributes]('checked')).changes().then(event => {
            const {oldValue, value} = event.detail
            if(value == false) this.showRequiredMessage()
            else this.allowNextStep()
        })
    })
</script>
```
As you can see in the example above, the `detail` key in the event object will contain some data about the attribute that changed; specifically, it tells you the old value (`.oldValue`), the new, current value (`.value`) and the attribute name (`.attribute`).

You might also want to listen to multiple attributes at the same time. For this, you may simply pass more attributes to the `this[attributes]` function. Yozo also allows you to use a wildcard, i.e. `this[attributes]('*')`, to listen to all attribute changes. The event handlers are guaranteed to be called in the same order you attached them.

Note that you _need_ to register the attributes using `define.attributes` in order to listen to their changes. If you want to listen to arbitrary attribute changes, even unregistered ones, use a mutation observer. This can be easily achieved with `when` as well:
```js
    define('custom-div')

    construct(function(){
        when(this).observes('mutation', {attributes: true}).then(() => {
            console.log('attribute changed!')
        })
    })
```

<a name="symbol-elements"></a>
#### `[elements]`

You've got a template, and you probably want access to the elements in it. This symbol lets you do so, by exposing the `querySelector` on the shadow root to you without you having to write it all out. You pass the selector to the `this[elements]` function directly, e.g. `this[elements]('button.btn > span')`. You also get a `querySelectorAll` variant, of course: `this[elements].all('button.btn > span')`. This returns an array of elements rather than a `NodeList`, allowing you to immediately use methods like `.filter` or `.map` on the result without having to use the spread operator on the result.

<a name="symbol-internals"></a>
#### `[internals]`

This exposes the element [internals](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals), including the shadowRoot (closed or not). It contains the object returned by [`attachInternals()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/attachInternals). If the element has been defined to be a form control (through `define.form()`) this also exposes the features related to that such as `setFormValue()`.

<a name="style"></a>
### `<style>`

Because you're working with custom elements, styles are scoped. This means that the styles you write here only apply to the elements in your `<template>` and don't bleed out to other elements. To make things a little nicer to look at, Yozo will not directly put the `<style>` element in the template; instead, it creates a stylesheet object and puts it onto the shadow root. That way, when inspecting elements, you won't have to look at walls of CSS.

## Notes

 - (Mostly so I don't forget this,) to minify, install `esbuild` and run `deno bundle ./index.js | esbuild --minify > ./index.min.js` in the project's root. Then, find the bit where it hardcoded a `file://` url and replace that bit so it reads from `import.meta`. Also, shorten the error messages (`Yozo: No top-level await`).
