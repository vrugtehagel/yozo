# Yozo

A small library enabling you to write high-quality, robust custom elements quickly and easily.

Yozo leverages custom elements and shadow DOM to achieve simple, encapsulated component-based front-end architectures. On top of allowing you to write single-file components with friendly API's, it provides a few functions to make your life easier. Some of them being used by Yozo itself, some specifically designed to have nice synergy with Yozo.

Not familiar with custom elements and/or shadow DOM? MDN has some great articles on the subjects; I recommend you read up on these two topics before using Yozo.

Just want to see some code in action? Here's an [example]().

## Installation

No installation is required! No configuration nonsense, just a simple
```js
import * as yozo from 'https://deno.land/x/yozo'
```
and you're good to go! You can also specify Yozo in your importmap, so you can simply import from `'yozo'` directly.

Note: you don't have to use deno for this to work!

## What do you get?

Now, what does Yozo actually get you? Well, the package itself only exports a handful of things. The big one is `register`; that allows you to define your custom elements.

### register

This function takes one or two arguments. The first is a URL (either a string or URL object), pointing to your custom element's definition. The second is an optional options object. It may contain an `as` key, with a custom element name as value, that the component will be registered as. This has a higher presedence than the name defined in the custom element's definition! This is mostly useful for renaming third-party components. Your registration will look more-or-less like this:
```js
import { register } from 'https://deno.land/x/yozo'

register('./path/to/custom-dropdown.ce')
register('https://example.com/custom-elements/toggle-switch.ce', {as: 'custom-switch'})
```
Note that importing the same URL multiple times, even with different options objects, doesn't register an element multiple times. A custom element will be registered only once. If you really need to define multiple custom elements with identical definitions, simply append some query parameters to the file URL.

### stateify

Available as a standalone package as well, see [stateify]().

### reversible, until

Available as a standalone package as well, see [reversibles]().

### when

A function from the library provided by `reversibles`, see [when]().

## In custom element definitions

The files you register with the `register` function are single-file custom element definitions. They contain the HTML, the logic and the styles needed for a single custom element. The file extension, while Yozo recommends `.ce`, really does not matter. A good alternative is just `.html`, since the custom element definitions are valid HTML, and so syntax highlighting will probably work out of the box. However, they're not valid HTML documents (just a part of a document), and really, they don't make a whole lot of sense on their own, without Yozo. Anyway, your file will look roughly like
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

### <template>

Your template will end up in the shadow DOM of the custom element. This means you can leverage everything that vanilla custom elements provide you - `<slot>`s, `part`s, simple classes and ids without having to worry about clashes, etcetera.

#### shadow

The shadow roots Yozo creates are closed by default, promoting encapsulation. You can, however, explicitly specify the shadow root to be open by adding the attribute `shadow="open"` on the `<template>` element.

### <script>

The script tag is where the magic happens. The code you write here is a JavaScript module, which means you can `import` things. Yozo provides a few "globals" for you to use - essentially, these are variables that are always available to you in the context of a custom element definition, but they're not actually on the `window`. They are being imported the same way you could import stuff, but you don't actually have to write the import statement. Also, while you can normally use top-level `await` expressions in modules, this is not allowed in custom element definitions.

#### define

You can call `define` as a function to provide a default custom element name. These may be overwritten using the options in the `register` function, but if you're writing the components for use in your own project, you will probably want to name them this way. For example:
```html
<script>
    define('custom-dropdown')
</script>
```

#### define.attribute

Defining, keeping track of, and creating properties for attributes was a bit of a hassle for vanilla custom elements. Yozo makes this easy. You can register attributes to be "observed attributes" by calling e.g. `define.attribute('serial-number')`. Then, you can use `this[attributes].serialNumber` to listen to changes in the attribute - see the section on `[attributes]` for more info on this. This is not where it ends though; `define.attribute` can take a second argument, an options object, that takes either one or both the `type` key and the `as` key.

The `type` key allows you to specify the type of date the attribute will take, which should be one of `'string'` (the default), `'number'` or `'boolean'`. Specifying the `type` key creates a property on the custom element bound to the attribute. For example,
```html
<script>
    define('shop-product')
    define.attribute('serial-number', {type: 'number'})
</script>
```
will allow you to get and set the attribute using the `.serialNumber` property. Note that the attribute gets converted to camelCase, similar to how existing HTML elements do it.

The `as` key allows you to rename the property. If, for example, you `define.attribute('serial-number', {type: 'number'})`, but you want to get and set this attribute with the `.serialnr` property rather than the `.serialNumber` property, you can specifiy `as: 'serialnr'` and Yozo will instead use that to define the property. You may also use an array of properties, so you could have both the `.serialNumber` as well as the `serialnr` properties at the same time for the same `serial-number` attribute.

#### define.method

With both the lifecycle callbacks as well as the introduction of private methods, custom element definitions can become hard to oversee. What are the methods exposed to the outside worlds, and what are the methods intended for internal logic? Yozo makes this a bit clearer. You define your methods explicitly by calling `define.method`. It takes a string or symbol as first argument, and a function (the method itself) as second argument. Something like so:
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

#### define.property

This function is very similar to `define.method`, but instead of methods, it allows you to define properties. The first argument it takes is the property name (either a string or a symbol) and the second argument may be either a function, if it is just a getter, or a complete descriptor object a la `Object.defineProperty`. Like with `define.method`, make sure to not use arrow functions if you need access to the custom element instance:
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

#### define.form

Custom elements may be form-associated, and this function lets you use this. Simply call it once, with no arguments, to opt-in to this behavior. This will get you the `this[internals]` property that is otherwise `null`, allowing you to set the underlying value for use in `<form>` elements. See the section on `[internals]` for more info.

#### construct

This is analogous to the constructor for custom elements. This time though, you don't need to call `super()`, attach your shadow DOM and template, or your CSS; Yozo does all of that for you, so that you can focus on the logic. Here, set up everything that needs to be alive for the entire duration of the component, whether connected to the document or not. For example, reactions to attribute changes, loading some data into the component, or setting up some of the state for the component.

#### connect

This is equivalent to the `connectedCallback` in custom elements. However, Yozo will automatically make the function your provide here a reversible - that means that you can just set up your component using reversible functions such as `when`, and Yozo will automatically take everything down for you, so that you don't have to define a `disconnect` callback at all. For example:
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

#### disconnect

Generally, you won't (shouldn't) need this. `connect` should automatically take everything down. Howver, if you want to, you may use this callback to take some things down manually. Note that you may be better off by writing a generic reversible helper so you can use it in other components as well without the mental overhead of a `disconnect` callback.

#### [attributes]

Yozo provides a few key things to you in the form of symbols, so that they are still shielded from the outside. The `[attributes]` symbol exposes event targets for the attributes you registered. They will fire the `change` event whenever that attribute changes. For example:
```html
<script>
    define('custom-checkbox')
    define.attribute('checked', {type: 'boolean'})

    construct(function(){
        when(this[attributes].checked).changes().then(event => {
            const {oldValue, value} = event.detail
            if(value == false) this.showRequiredMessage()
            else this.allowNextStep()
        })
    })
</script>
```
As you can see in the example above, the `detail` key in the event object will contain some data about the attribute that changed; specifically, it tells you the old value (`.oldValue`), the new, current value (`.value`) and the attribute name (`.attribute`).

You might also want to listen to multiple attributes at the same time. For this, Yozo provides yet another symbol, allowing you to do `this[attributes][any]`. That exposes an event target that fires a `change` event every time _any_ observed attribute changes. The `event.detail` object will contain the same data as mentioned previously.

#### [elements]

You've got a template, and you probably want access to the elements in it. This symbol lets you, in two different ways. If you want to reference an element by its id, you may just use a property accessor. For example, if have an element with `id="menu-button"`, you can access that element using `this[elements].menuButton`. Note that Yozo transforms the kebab-case id names to camelCase for convenience. These elements will also be cached, so you don't have to worry about that as elements with ids are not likely to change. Sometimes though, you'll want to find an element using a selector, like you would do with `querySelector`. You can do this by simply calling `this[elements]` as a function, something like `this[elements]('.list > .item[data-id=23]')`. These are not cached.

Lastly, you may want to do a `querySelectorAll` - you can do this by calling `this[elements].all('.list > .item')`. Note that this means you cannot reference elements with `id="all"` using `this[elements].all`!

#### [internals]

This exposes the element internals, including the shadowRoot (closed or not). It contains the object returned by `attachInternals()`. If the element has been defined to be a form control (through `define.form()`) this also exposes the features related to that.

### <style>

Because you're working with custom elements, styles are scoped. This means that the styles you write here only apply to the elements in your `<template>` and don't bleed out to other elements. To make things a little nicer to look at, Yozo will not directly put the `<style>` element in the template; instead, it creates a stylesheet object and puts it onto the shadow root. That way, when inspecting elements, you won't have to look at walls of CSS.
