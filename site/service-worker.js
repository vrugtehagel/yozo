// Modules are not here yet, so there are modified versions for each module
// that simply throw things into the global scope
// That way, we can use importScripts and still separate related code

// Refactor when ES6 modules are supported in service workers

importScripts('/dev.js')
importScripts('/-/js/service-worker/service-worker.js')
importScripts('/-/js/context-messenger/service-worker.js')
importScripts('/-/js/file-system/service-worker.js')
