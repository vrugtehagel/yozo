# Test kit

I'm not a huge fan of writing tests in Deno's standard library. For simple things, it works just fine. But for Yozo, I need to be extremely detailed in terms of what I'm testing, and so a lot of tests do a very similar if not the same setup. The repetition is just not great. Besides, it's not very readable to just repeat the same code over and over, even if that code itself is readable.

You can abstract this away by using helper functions, but that completely obstructs the actual test itself. I want to be able to understand a test without going into different files and/or having to test the helper functions. Additionally, helper functions abstract away scope, which ultimately ends up making things more complicated than it needs to be.

## The solution

So, here's my solution. I write snippets of code, with a comment describing what it does. For example:
```js
// a variable foo gets initialized to 23
const foo = 23
```
Of course, these may be more complex than that, and they may even contain parameters (i.e. direct substitutions):
```js
// a variable __name__ gets initialized to __value__
const __name__ = __value__
```
Now, to test, we write a block of comments, like so:
```js
// Test: you can add variables to each other
// Given a variable foo gets initialized to 23
// and a variable bar gets initialized to 1
// When a variable result gets initialized to foo + bar
// Then the result is 24
```
The latter, `the result is __value__`, has another user-defined meaning. Now, the test is completely readable (it's just text) and the test kit has compiled the tests into code. That means we can write readable tests, and execute readable code.

## Test verifyability
This test framework runs one extra step. It can verify tests make sense by running the "given"s, and not the "when"s, and then verifying that the assertions fail. If an assertion does not fail in that context, the assertion is unnecessary and doesn't actually add to the test. Note that the assertions _must not_ throw errors regardless of whether or not the "when"s are included.

Note that this means testing something does _not_ change is a bit more difficult, because it would fail verification. Thet's why you get, on top of "given", "when", and "then", an extra check "verify". This is identical to "then" in regular tests but will be checked to remain true even in verification (whereas "then" assertions will be checked to be false in test verifications).

## Additional requirements

For Yozo's site, I want to be able to display _and run_ code in the browser. This is because it could help people who want to understand a feature in more detail, it allows for catching browser-specific errors and it allows for testing web components (which Deno cannot do without a library). This means the above test framework prioritizes size over performance (to a certain degree). In other words, I won't be importing whole chunks of Deno's test utils in people's browsers.

So, what do I need?
 - Transpilation in the browser
 - Tests need: Code with & without comments, inline-runnability & verifyability.
