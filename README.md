# YOZO

## References (for the site)

References. Similar frameworks:
 - [Lit](https://lit.dev/)
 - [Stencil](https://stenciljs.com/)
 - [Bit](https://bit.dev/)

And some other frameworks
 - [Vue](https://vuejs.org/)
 - [React](https://reactjs.org/)
 - [Angular](https://angular.io/)
 - [Svelte](https://svelte.dev/)
 - [Ember](https://emberjs.com/)
 - [styled components](https://styled-components.com/)
 
## Todo

 - Add typescript support
 - Create npm package
 - Create site (home - tour - docs - play - blog)
 - Fix this repo
 - write more tests & make sure they pass
 - (prepare 12 blog posts?)
    - Yozo Origins: API Designing
    - Yozo Origins: How I Solved Imports
    - Yozo Origins: Providing a High Quality Experience
    - Yozo Origins: Iterating & Testing
    - Yozo Origins: Designing the Website (written by Jina?)
    - Embracing Type Coercion (`watch`)
    - Tracking a Function's Every Move (`when`)
    - Custom Stuff is Always Better
    - Should You Test Your Components?
    - What is Nice Code?
    - Tutorial: Web Components
    - Tutorial: Your Own Features in Yozo
    - Tutorial: Internationalization with Yozo
    - Tutorial: Accessibility with Yozo
    - Tutorial: Form Controls with Yozo


## The problem with imports

Essentially, this is the challenge: running a string as ES6 module, while having full control over what `import.meta.url` resolves to in that string.

### Ideas

So I tried a few things, and here they are.

 1. The ugly solution is to write some complicated and unwieldy regular expression to just change the `import` statements so that all URLs are absolute and pointing to the intended files. This a theorically viable solution, but in practice it's not great because
     - it is very error-prone
     - it requires extra work for dynamic imports
     - it requires manual attention to everything surrounding this as well, such as manually changing the value of `import.meta.url`.

 2. A relatively good solution is the following: create a `<script type=module>` element dynamically, and before appending it to the document (which would run it), quickly create a `<base>` element with a certain `href` (or change the `href` if there is an existing `<base>` element). Append them to the document together, and then immediately remove the `<base>` element. This makes it so that the `<script>` honours the base URL of the document, which is the value of the `href` of that temporary `<base>` element, and it will then use that as `import.meta.url`. However this is also not a good solution because
     - Theoretically, a resource download can be triggered between adding and removing the `<base>` element, which would cause that download to fail as the URL is resolved to some bogus URL.
     - Actually, Chrome and Firefox would make this seem like an almost viable solution because you can remove the `<base>` element immediately after appending the `<script>` element (which means it would only be there for a fraction of time) however Safari waits until it runs the script before it resolves the `import.meta` of the script, forcing the `<base>` element to be present until the script runs. This makes the chance that another resource will be downloaded in the mean time significantly higher.

 3. A variation on the previous solution that doesn't run the risk of meddling with other resources is to create an iframe, and running the script there. This works (sort of) but it has weaknesses too:
     - it pollutes the HTML of the original page with one or more iframes (and is probably not memory-efficient).
     - the imports in the top level frame and the iframe point at different objects. E.g. if `./foo.js` exports an object `{}`, then setting a property on it in one frame won't be seen in the other. This would not be what the user expects, as they're just doing regular imports and so assume those would be sharing the same document.

 4. A service worker. It would be able to just intercept the request to the original (non-JS) file, transform it, and respond with the transformed JS file. Or, it can intercept requests to a fake URL (supposedly pointing to the transformed version) and respond with the transformed version. However this fails to be a good candidate since
     - it requires the user to upload the service worker file to the project. It cannot be a blob or data URL.
     - does not work in private browsing mode

### Notes

 - Blobs don't work because they can't resolve the imports at all
 - Data URLs are basically different ways to do things but lead to the same issues
    - `text/javascript` data URLs have the same issue as blobs as they cannot resolve relative URLs at all
    - `text/html` kind of works because you can specify the URL with a `<base>` element but suffers from the same issues as solution #3 because it runs the JS in a different document.

### Notes on #2

There are a few observations to make.

First of all, this is the most viable option. It requires nothing from the user and is reliable apart from the resource fetching issue. However, it is unclear how big that issue is and it may be negligable - so we'll do some testing.

First of all, it takes a little under half a millisecond (around .4ms) to actually run a script that has been appended to the DOM (assuming it's not doing anything else). Is that a lot? No idea.

So let's just test it in practice. I loaded up a page that has 1000 "different" images (or well, are treated as such) and `loading="lazy"`. Then, we do the whole "create script, create base, append both to head, wait for script to run, remove base" spiel in a 1ms interval (which'll be clamped so something larger, but still) and scroll down on the page. On Firefox and Safari, no issues; on Chrome, this produces bogus resource requests. However, there's another difference in browsers that may save us. Chrome and Firefox will resolve `import.meta` for appended scripts at the moment they are appended. This means we literally get to add the base element, the script, and immediately remove the base. This works in Firefox and Chrome, but not in Safari - which means we need both methods to work cross-browser.

Here's the solution.

First, test if the "add base, add script, remove base" method works. If it does, use that method - it leaves practically no window for bogus requests. This will be the case in Chrome and Firefox. If this test fails, however (which in practice means we're dealing with Safari) then we can just remove the base _after_ the script has run. This works in Safari.

Theoretically, this method _could_ fail in another browser. However even if it _could_ fail it is extremely unlikely to. There's only a fraction of time a bogus request can be created, and this is _after_ all the main resources of the document have been resolved (since it's being done from a module).
