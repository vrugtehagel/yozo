// Yozo version: 0.3.1
(() => {
  // src/help.js
  var printer = (show = console.log, suppress) => (parts, ...subs) => {
    const expanded = String.raw(parts, ...subs);
    const id = String.raw(parts, ...subs.map((sub, index) => `$${index + 1}`));
    if (suppress && printer.memory.has(expanded))
      return;
    printer.memory.add(expanded);
    const indentedMessage = messages[id](...subs);
    let message = indentedMessage.replaceAll(/^\s+/gm, "").trim();
    if (suppress)
      message += "\n" + suppress;
    show(message);
  };
  printer.memory = /* @__PURE__ */ new Set();
  var error = printer((message) => {
    throw new Error(message);
  });
  var warn = printer((message) => console.warn(message));
  var warnOnce = printer(
    (message) => console.warn(message),
    "Warnings after this one will be suppressed"
  );
  var messages = {
    "when-arg-not-event-target": () => `
		Could not attach event listener(s) with when(\u2026);
		Not all of its arguments were EventTargets.`,
    "when-cannot-observe-$1-no-$2": (type, name) => `
		Failed at when(\u2026).observe('${type}').
		This occurred because "${name}Observer" doesn't exist.`,
    "when-$1-instead-of-$2-mistake": (property, type) => `
		when(\u2026).{property}() may be a mistake, as it listens to the "${type}" event.
		If you want to listen to the "${property}" event, use .does('${property}').`,
    "monitor-add-$1-not-in-registry": (name) => `
		An item was added to "${name}", but "${name}" was not registered.
		Register it first using monitor.register('${name}', class { \u2026 }).`,
    "monitor-cannot-register-result": () => `
		"result" cannot be registered as a monitorable.
		Tracked calls already store their result under this key.`,
    "monitor-registry-already-has-$1": (name) => `
		monitor.register('${name}', \u2026) was called, but "${name}" was already registerd.
		You cannot overwrite an existing registration; re-registrations are ignored.`,
    "monitor-$1-definition-must-be-class": (name) => `
		Registering "${name}", but its definition was not a class.
		Register it using monitor.register('${name}', class { \u2026 }).`,
    "flow-stopped-but-triggered": () => `
		A flow was triggered after it stopped. Often, this indicates a memory leak.
		Make sure you use .cleanup(\u2026) to undo everything triggering the flow.`,
    "live-$1-on-non-live": (method) => `
		live.${method}(\u2026) was called, but its first argument wasn't live.
		This was probably a mistake; it does nothing.`,
    "live-property-$1-not-iterable": (key) => `
		Cannot iterate over .$${key} because its value is not iterable.`,
    "live-link-target-$1-not-live": (guess) => `
		Something non-live was passed to live.link(\u2026).
		Probably, you missed the $ in .$${guess}.`,
    "live-link-target-not-live": () => `
		Something non-live was passed to live.link(\u2026).
		Make sure its first argument is a live variable.`,
    "live-property-$1-doubled": (key) => `
		Objects with (nested) live properties should not be live themselves.
		Now .${key} is live and .$${key} is double-live, which is confusing.`,
    "live-property-set-$1-has-$": (key) => `
		The "${key}" property was set, which may have been unintentional.
		To set the "${key.slice(1)}" property instead, use $object.${key.slice(1)} = \u2026.`,
    "live-property-delete-$1-has-$": (key) => `
		The "${key}" property was deleted, which may have been unintentional.
		To delete the "${key.slice(1)}" property, use delete $object.${key.slice(1)}.`,
    "define-missing-title": () => `
		Component definition is missing <title>\u2026</title>.
		This is required, as it determines the component's tag name.`,
    "define-attribute-$1-type-$2-does-not-exist": (attribute, type) => `
		Attribute "${attribute}" defined type "${type}", but that doesn't exist.
		The type attribute is converted to PascalCase, and that must be a global.`,
    "transform-for-$1-not-iterable": (expression) => `
		Expression "${expression}" in #for is not iterable.`,
    "transform-if-found-loose-$1": (statement) => `
		Found an "${statement}" attribute without an #if.
		Make sure the element follows an element with an #if or #else-if.`
  };

  // src/utils.js
  var S = Symbol();
  var R = Symbol();
  var camelCase = (string) => string.replace(
    /-+(\w?)/g,
    (full, character) => character.toUpperCase()
  );
  var compose = (objects) => {
    const result = { constructor: null };
    for (const object of objects)
      for (const key of Object.keys(object))
        result[key] ??= function(...args) {
          objects.map((object2) => object2[key]?.call(this, ...args));
        };
    return result;
  };

  // src/flow.js
  var Flow = class {
    #steps = [];
    #cleanup = [];
    #stopped;
    #stopping;
    #stopIndex;
    constructor(callback) {
      monitor.add("undo", () => this.stop());
      callback?.((...args) => {
        if (this.#stopped)
          warn`flow-stopped-but-triggered`;
        this.now(...args);
      });
    }
    flow(callback) {
      this.#steps.push(callback);
      return this;
    }
    now(...args) {
      let index = -1;
      const next = () => {
        if (this.#stopped)
          return;
        index++;
        if (index < this.#stopIndex)
          return;
        if (this.#stopping)
          this.#stopIndex = index + 1;
        if (this.#steps.length + 1 == this.#stopIndex)
          this.stop();
        this.#steps[index]?.(next, ...args);
      };
      next();
      return this;
    }
    then(callback) {
      return this.flow((next, ...args) => {
        callback(...args);
        next();
      });
    }
    await(callback) {
      return this.flow(async (next, ...args) => {
        await callback(...args);
        next();
      });
    }
    if(callback) {
      return this.flow((next, ...args) => {
        if (callback(...args))
          next();
      });
    }
    or(flow) {
      flow.then((...args) => this.now(...args));
      return this.cleanup(() => flow.stop?.());
    }
    stop() {
      if (this.#stopped)
        return;
      this.#stopped = true;
      this.#steps.splice(0);
      this.#cleanup.splice(0).map((callback) => callback());
      return this;
    }
    until(thing) {
      if (typeof thing == "function")
        return this.flow((next, ...args) => thing(...args) ? this.stop() : next());
      this.cleanup(() => thing.stop?.());
      thing.then(() => this.stop());
      return this;
    }
    cleanup(callback) {
      if (this.#stopped)
        callback();
      else
        this.#cleanup.push(callback);
      return this;
    }
    once() {
      return this.then(() => this.#stopping = true);
    }
    debounce(duration) {
      let id;
      return this.flow((next) => {
        clearTimeout(id);
        id = setTimeout(next, duration);
      }).cleanup(() => clearTimeout(id));
    }
    throttle(duration) {
      let queued;
      let id;
      return this.flow((next) => {
        if (id)
          return queued = next;
        next();
        id = setInterval(() => {
          if (!queued) {
            clearTimeout(id);
            id = 0;
            return;
          }
          queued();
          queued = null;
        }, duration);
      }).cleanup(() => clearTimeout(id));
    }
    after(callback) {
      queueMicrotask(() => queueMicrotask(callback));
      return this;
    }
  };

  // src/when.js
  var when = (...targets) => new Proxy({
    does: (type, options) => {
      let handler;
      return new Flow((trigger) => {
        handler = trigger;
        if (!targets.every((target) => typeof target?.addEventListener == "function"))
          error`when-arg-not-event-target`;
        targets.map((target) => target.addEventListener(type, handler, options));
      }).cleanup(() => targets.map((target) => target.removeEventListener(type, handler, options)));
    },
    observes: (type, options) => {
      let observer;
      return new Flow((trigger) => {
        const name = camelCase(`-${type}-observer`);
        if (typeof self[name] != "function")
          error`when-cannot-observe-${type}-no-${name}`;
        observer = new self[camelCase(`-${type}-observer`)](trigger, options);
        targets.map((target) => observer.observe(target, options));
      }).cleanup(() => observer.disconnect());
    }
  }, { get: (source, property) => {
    const type = property.replace(/s$/, "");
    if (!source[property] && type != property && "on" + property in self)
      warn`when-${property}-instead-of-${type}-mistake`;
    return source[property] ?? source.does.bind(null, property.replace(/s$/, ""));
  } });

  // src/effect.js
  var effect = (callback, schedule = queueMicrotask) => {
    let updater;
    const flow = new Flow().then(() => {
      const call = monitor(["undo", "live"], callback);
      updater = monitor.ignore(() => when(call.live).change()).once().then(() => schedule(() => flow.now())).cleanup(() => call.undo());
    }).cleanup(() => updater?.stop());
    schedule(() => flow.now());
    return flow;
  };

  // src/live.js
  var live = (thing) => new LiveCore({ __value: { $: live.get(thing) } }, "$").__$value;
  live[R] = /* @__PURE__ */ new WeakMap();
  var roots = /* @__PURE__ */ new WeakMap();
  var access = async (key) => {
    access.recent = key;
    await "mircrotask";
    access.recent = null;
  };
  var LiveCore = class {
    constructor(parent, key, root = this) {
      this.__parent = parent;
      this.__key = key;
      this.__root = root;
      this.__cache = {};
      this.__$value = new Proxy(new EventTarget(), {
        get: (target, key2) => {
          if (key2 == Symbol.iterator) {
            access(key2);
            return () => {
              if (!this.__value[key2])
                error`live-property-${this.__key}-not-iterable`;
              monitor.add("live", this.__$value, "keychange");
              return [...this.__value].map((thing, index) => this.__cached(index).__$value)[key2]();
            };
          }
          if (key2[0] == "$")
            return this.__cached(key2.slice(1)).__$value;
          access(key2);
          if (target[key2])
            return target[key2].bind(target);
          monitor.add("live", this.__cached(key2).__$value, "deepchange");
          return this.__value?.[key2];
        },
        set: (target, key2, value) => {
          if (key2[0] == "$")
            warn`live-property-set-${key2}-has-$`;
          return live.set(this.__cached(key2).__$value, value);
        },
        deleteProperty: (target, key2, value) => {
          if (key2[0] == "$")
            warn`live-property-delete-${key2}-has-$`;
          return live.delete(this.__cached(key2).__$value);
        },
        has: (target, key2) => {
          monitor.add("live", this.__$value, "keychange");
          return this.__value != null && target[key2] || key2 in this.__value;
        },
        ownKeys: () => {
          monitor.add("live", this.__$value, "keychange");
          return Object.keys(this.__value ?? {}).map((key2) => `$${key2}`);
        },
        getOwnPropertyDescriptor: () => ({ configurable: true, enumerable: true }),
        defineProperty: () => false
      });
      live[R].set(this.__$value, this);
      if (root == this)
        roots.set(this, /* @__PURE__ */ new Set());
      roots.get(root).add(new WeakRef(this));
      this.__value = this.__parent.__value?.[this.__key];
      this.__keys = Object.keys(this.__value ?? {});
    }
    __cached(key) {
      return this.__cache[key] ??= new LiveCore(this, key, this.__root);
    }
    __alter(alteration, deepChanges = /* @__PURE__ */ new Set([this])) {
      const result = alteration?.();
      const oldValue = this.__value;
      const value = this.__parent.__value?.[this.__key];
      this.__value = value;
      if (!Object.is(oldValue, value))
        this.__$value.dispatchEvent(new CustomEvent("change", { detail: { oldValue, value } }));
      const keys = Object.keys(this.__value ?? {});
      const diff = new Set(this.__keys);
      this.__keys = keys;
      for (const key of keys)
        if (diff.has(key))
          diff.delete(key);
        else
          diff.add(key);
      if (diff.size)
        this.__$value.dispatchEvent(new CustomEvent("keychange", { detail: { keys: [...diff] } }));
      let core = this.__parent;
      deepChanges.add(this);
      while (!deepChanges.has(core) && core.__parent) {
        core.__alter(null, deepChanges);
        deepChanges.add(core);
        core = core.__parent;
      }
      if (Object.is(oldValue, value))
        return result;
      for (const core2 of Object.values(this.__cache))
        core2.__alter(null, deepChanges);
      if (!alteration)
        return;
      for (const core2 of deepChanges)
        core2.__$value.dispatchEvent(new CustomEvent("deepchange"));
      return result;
    }
  };
  live.get = ($live, key) => {
    const core = live[R].get($live);
    if (!core)
      return key == null ? $live : $live[key];
    access(key == null ? core.__key : key);
    if (key != null)
      return core.__cached(key).__value;
    monitor.add("live", $live, "deepchange");
    return core.__value;
  };
  live.set = ($live, value) => {
    const core = live[R].get($live);
    return !!core?.__alter(() => {
      if (core.__parent.__value == null)
        return false;
      core.__parent.__value[core.__key] = live.get(value);
      return true;
    });
  };
  live.delete = ($live, value) => {
    const core = live[R].get($live);
    return !!core?.__alter(() => {
      if (core.__parent.__value == null)
        return false;
      return delete core.__parent.__value[core.__key];
    });
  };
  live.link = ($live, thing) => {
    if (!live[R].has($live))
      if (access.recent)
        error`live-link-target-${access.recent}-not-live`;
      else
        error`live-link-target-not-live`;
    let cache;
    let options = thing;
    if (thing instanceof HTMLElement) {
      options = {
        get: () => thing.value,
        set: (value) => thing.value = value,
        changes: when(thing).input()
      };
    } else if (typeof thing == "function") {
      options = {
        get: () => cache,
        changes: effect(() => cache = thing(), (update) => update())
      };
    }
    let changing;
    const change = (value) => {
      changing = true;
      live.set($live, value);
      cache = value;
      changing = false;
    };
    const listener = when($live).deepchange().then(() => {
      if (changing)
        return;
      if (!options.set)
        return change(cache);
      options.set(monitor.ignore(() => live.get($live)));
      change(monitor.ignore(options.get));
    });
    change(monitor.ignore(options.get));
    return (options.changes ?? new Flow()).then(() => change(monitor.ignore(options.get))).if(() => null).cleanup(() => listener.stop());
  };

  // src/monitor.js
  var monitor = (names, callback) => {
    const before = monitor[S];
    monitor[S] = {};
    const call = {};
    names.map((name) => {
      monitor[S][name] = new monitor[R][name]();
      call[name] = monitor[S][name].result;
    });
    call.result = callback();
    monitor[S] = before;
    return call;
  };
  var until = (thing) => {
    if (!monitor[S])
      return thing;
    const before = monitor[S];
    monitor[S] = null;
    return { then: (resolve) => Promise.resolve(thing).then((result) => {
      if (Object.keys(before).some((name) => before[name].until?.()))
        return;
      queueMicrotask(() => monitor[S] = before);
      resolve(result);
      queueMicrotask(() => monitor[S] = null);
    }) };
  };
  monitor.ignore = (callback) => monitor([], callback).result;
  monitor.add = (name, ...things) => {
    if (!monitor[R][name])
      warn`monitor-add-${name}-not-in-registry`;
    monitor[S]?.[name]?.add(...things);
  };
  monitor.register = (name, registration) => {
    if (name == "result")
      warn`monitor-cannot-register-result`;
    if (monitor[R][name])
      warn`monitor-registry-already-has-${name}`;
    monitor[R][name] ??= registration;
  };
  monitor[R] = {
    result: true,
    undo: class {
      [R] = [];
      #stopped;
      result = () => {
        if (this.#stopped)
          return;
        this[R].splice(0).map((callback) => callback());
        this.#stopped = true;
      };
      add(callback) {
        if (this.#stopped)
          return callback();
        this[R].push(callback);
      }
      until() {
        return this.#stopped;
      }
    },
    live: class {
      [R] = /* @__PURE__ */ new Map();
      result = new EventTarget();
      add($live, type) {
        const cache = this[R].get($live) ?? [];
        if (cache.includes(type))
          return;
        cache.push(type);
        this[R].set($live, cache);
        monitor.ignore(() => when($live).does(type)).then(() => this.result.dispatchEvent(new CustomEvent("change")));
      }
    }
  };

  // src/purify.js
  var purify = (callback) => {
    let call;
    return (...args) => {
      call?.undo();
      call = monitor(["undo"], () => callback(...args));
      return call.result;
    };
  };

  // src/timers.js
  var interval = (duration) => {
    let id;
    return new Flow((trigger) => id = setInterval(trigger, duration)).cleanup(() => clearInterval(id));
  };
  var timeout = (duration) => interval(duration).once();
  var frame = () => {
    let id;
    return new Flow((trigger) => {
      const next = () => id = requestAnimationFrame((time) => {
        next();
        trigger(time);
      });
      next();
    }).cleanup(() => cancelAnimationFrame(id));
  };
  var paint = () => {
    let count = 0;
    return frame().if(() => count++).once();
  };

  // src/define.js
  var define = (definer) => {
    const context = {
      x: /* @__PURE__ */ new Set(["query", "$"]),
      __meta: /* @__PURE__ */ new WeakMap(),
      __body: class extends HTMLElement {
        constructor() {
          super();
          context.__meta.set(this, { x: {} });
          monitor.ignore(() => composed.constructor.call(this, context.__meta.get(this)));
        }
      }
    };
    const calls = {};
    definer(Object.fromEntries(
      define[R].map(([mod, name]) => [name, (...args) => (calls[name] ??= []).push(args)])
    ));
    const mixins = define[R].map(([mod, name]) => mod(context, calls[name] ?? []));
    const composed = compose(mixins);
    Object.entries(composed).map(([key, callback]) => {
      return context.__body.prototype[key] ??= function(...args) {
        return monitor.ignore(() => callback.call(this, context.__meta.get(this), ...args));
      };
    });
    customElements.define(context.__title, context.__body);
    return customElements.whenDefined(context.__title);
  };
  define[R] = [];
  define.register = (priority, name, mod) => {
    define[R].push([mod, name, priority]);
    define[R].sort((a, b) => a[2] - b[2]);
  };
  define[S] = [];
  define.transform = (priority, transform) => {
    define[S].push([transform, priority]);
    define[S].sort((a, b) => a[1] - b[1]);
  };

  // src/register.js
  var register = async (url) => {
    if (register[R].has(`${url}`))
      return;
    register[R].add(`${url}`);
    const response = await fetch(url);
    const template = document.createElement("template");
    template.innerHTML = await response.text();
    return define((add) => {
      for (const element of template.content.children) {
        add[element.localName]?.(
          Object.fromEntries([...element.attributes].map((attribute) => [camelCase(attribute.name), attribute.value])),
          element.innerHTML
        );
      }
    });
  };
  register[R] = /* @__PURE__ */ new Set();
  var cancelled;
  register.auto = (find) => {
    if (register.auto[R])
      return;
    register.auto[R] = /* @__PURE__ */ new Set();
    const autoDefine = (name) => {
      if (register.auto[R].has(name))
        return;
      register.auto[R].add(name);
      const url = find(name);
      if (!url)
        return;
      register(url);
    };
    const from = (root) => {
      for (const element of root.querySelectorAll(":not(:defined)"))
        autoDefine(element.localName);
      for (const template of root.querySelectorAll("template"))
        from(template.content);
    };
    define.register(6, Symbol(), (context) => {
      if (cancelled)
        return {};
      if (context.__template)
        from(context.__template);
      return {};
    }, {});
    return when(document).observes("mutation", { childList: true, subtree: true }).then(() => from(document)).now().if(() => null).cleanup(() => cancelled = true);
  };

  // src/mods/00-title.js
  define.register(0, "title", (context, [args]) => {
    if (!args?.[1])
      error`define-missing-title`;
    context.__title = args[1];
    return {};
  });

  // src/mods/01-meta.js
  define.register(1, "meta", (context, argslist) => {
    const attributes = argslist.filter((args) => args[0].attribute);
    const properties = [
      ...argslist.filter((args) => args[0].property),
      ...attributes.filter((args) => args[0].type).map((args) => [{ property: args[0].as ?? camelCase(args[0].attribute) }]),
      ...argslist.filter((args) => args[0].method).map((args) => [{ property: args[0].method, readonly: true }])
    ];
    properties.map(([options]) => {
      const get = function() {
        return monitor.ignore(() => live.get(context.__meta.get(this).x.$, options.property));
      };
      Object.defineProperty(
        context.__body.prototype,
        options.property,
        "readonly" in options ? { get } : { get, set: function(value) {
          monitor.ignore(() => context.__meta.get(this).x.$[options.property] = value);
        } }
      );
    });
    context.__body.observedAttributes = attributes.map((args) => args[0].attribute);
    context.__body.formAssociated = argslist.some((args) => args[0].formAssociated != null);
    const constructor = function(meta) {
      meta.x.$ = live({ attributes: {} });
      attributes.map(([options]) => {
        const name = camelCase(options.attribute);
        meta.x.$.$attributes[name] = null;
        when(meta.x.$.$attributes[`$${name}`]).change().then(() => {
          const value = live.get(meta.x.$.$attributes, name);
          if (value == null)
            this.removeAttribute(options.attribute);
          else
            this.setAttribute(options.attribute, value);
        });
        if (options.type == "boolean") {
          live.link(meta.x.$[`$${options.as ?? name}`], {
            get: () => live.get(meta.x.$.$attributes, name) != null,
            set: (value) => meta.x.$.$attributes[name] = value ? "" : null,
            changes: when(meta.x.$.$attributes[`$${name}`]).change()
          });
        } else if (options.type) {
          const type = self[camelCase(`-${options.type}`)];
          if (!type)
            error`define-attribute-${options.attribute}-type-${type}-does-not-exist`;
          live.link(meta.x.$[`$${options.as ?? name}`], {
            get: () => type(live.get(meta.x.$.$attributes, name) ?? options.default ?? ""),
            set: (value) => meta.x.$.$attributes[name] = value == null ? null : `${value}`,
            changes: when(meta.x.$.$attributes[`$${name}`]).change()
          });
        }
      });
      properties.map(([{ property }]) => {
        if (!Object.hasOwn(this, property))
          return;
        const oldValue = this[property];
        delete this[property];
        this[property] = oldValue;
      });
    };
    const attributeChangedCallback = function(meta, name, oldValue, value) {
      meta.x.$.$attributes[camelCase(name)] = value;
    };
    return { constructor, attributeChangedCallback };
  });

  // src/mods/02-hooks.js
  define.register(2, "meta", (context, argslist) => {
    return compose([
      ...argslist,
      [{ hook: "connected", unhook: "disconnected" }],
      [{ hook: "disconnected" }]
    ].map((args) => {
      const { hook, unhook } = args[0];
      if (!hook)
        return {};
      context.x.add(hook);
      const constructor = function(meta) {
        meta.x[hook] = (callback) => {
          const item = [new Flow().then((...args2) => {
            item[1]?.undo();
            item[1] = monitor(["undo"], () => callback?.(...args2));
          }).cleanup(() => {
            item[1]?.undo();
            meta.x[hook][R].delete(item);
          })];
          meta.x[hook][R].add(item);
          if (meta.x[hook][S])
            queueMicrotask(() => item[0].now(...meta.x[hook][S]));
          return item[0];
        };
        meta.x[hook][R] = /* @__PURE__ */ new Set();
      };
      const hookCallback = function(meta, ...args2) {
        meta.x[hook][S] = args2;
        for (const item of meta.x[hook][R])
          item[0].now(...args2);
      };
      if (!unhook)
        return { constructor, [`${hook}Callback`]: hookCallback };
      return {
        constructor,
        [`${hook}Callback`]: hookCallback,
        [`${unhook}Callback`]: function(meta, ...args2) {
          meta.x[hook][S] = null;
          for (const item of meta.x[hook][R])
            item[1]?.undo();
        }
      };
    }));
  });

  // src/mods/03-transforms.js
  define.register(3, Symbol(), (context) => {
    const constructor = function(meta) {
      meta.__function = (expression, ...scopes) => {
        const variables = scopes.map(() => `$${camelCase(crypto.randomUUID())}`);
        const result = new Function(
          ...variables,
          `var ${scopes.map((scope, index) => `${scope[0]}=${variables[index]}`)};return(${expression})`
        );
        return (thisArg, ...scopes2) => result.call(thisArg, ...scopes2.map((scope) => scope[1]));
      };
      meta.__render = (node, ...scopes) => {
        const root = node.cloneNode(true);
        const iterator = document.createNodeIterator(root, 5);
        let current;
        iteration:
          while (current = iterator.nextNode()) {
            if (current.nodeType == 1) {
              for (const [callback] of define[S]) {
                for (const attribute of [...current.attributes]) {
                  callback(attribute, scopes, meta, context);
                  if (iterator.referenceNode != current)
                    continue iteration;
                }
              }
            }
            for (const [callback] of define[S]) {
              callback(current, scopes, meta, context);
              if (iterator.referenceNode != current)
                continue iteration;
            }
          }
        return root;
      };
    };
    return { constructor };
  });

  // src/mods/05-template.js
  define.register(5, "template", (context, [args]) => {
    if (!args) {
      return {
        constructor: function(meta) {
          meta.root = this;
        }
      };
    }
    const template = document.createElement("template");
    template.innerHTML = args[1];
    context.__template = template.content;
    if (args[0].mode) {
      return {
        constructor: function(meta) {
          meta.root = this.attachShadow(args[0]);
          meta.root.append(meta.__render(context.__template, [`{${[...context.x]}}`, meta.x]));
          customElements.upgrade(meta.root);
        }
      };
    }
    return {
      constructor: function(meta) {
        meta.root = meta.__render(context.__template, [`{${[...context.x]}}`, meta.x]);
        customElements.upgrade(meta.root);
      },
      connectedCallback: function(meta) {
        if (meta.root == this)
          return;
        this.replaceChildren(meta.root);
        meta.root = this;
      }
    };
  });

  // src/mods/07-query.js
  define.register(7, Symbol(), (context) => {
    const constructor = function(meta) {
      meta.x.query = (selector) => meta.root.querySelector(selector);
      meta.x.query.all = (selector) => [...meta.root.querySelectorAll(selector)];
    };
    return { constructor };
  });

  // src/mods/08-style.js
  define.register(8, "style", (context, [args]) => {
    if (!args)
      return {};
    const sheet = new CSSStyleSheet();
    sheet.replace(args[1]);
    return { connectedCallback: function(meta) {
      const root = meta.root.mode ? meta.root : this.getRootNode();
      const sheets = root.adoptedStyleSheets;
      if (sheets.includes(sheet))
        return;
      root.adoptedStyleSheets = [...sheets, sheet];
    } };
  });

  // src/mods/10-script.js
  define.register(10, "script", (context, [args]) => {
    if (!args)
      return {};
    const callback = new Function(`{${[...context.x]}}`, `const{${Object.keys(self.yozo)}}=self.yozo;${args[1]}`);
    return {
      constructor: function(meta) {
        callback.call(this, meta.x);
      }
    };
  });

  // src/transforms/00-inline-text.js
  define.transform(0, (node, scopes, meta, context) => {
    if (node.nodeType != 3)
      return;
    const parts = node.textContent.split(/{{([^]*?)}}/g);
    node.before(...parts);
    let current = node;
    parts.map((part, index) => {
      current = current.previousSibling;
      if (index % 2 == 0)
        return;
      const node2 = current;
      const getter = meta.__function(node2.textContent, ...scopes);
      meta.x.connected(() => effect(
        () => node2.textContent = getter(null, ...scopes)
      ));
    });
    node.remove();
  });

  // src/transforms/01-for.js
  define.transform(1, (node, scopes, meta, context) => {
    if (node.nodeType != 2)
      return;
    if (node.name != "#for")
      return;
    const element = node.ownerElement;
    element.removeAttribute(node.name);
    const [initializer, arrayExpression] = node.value.split(" of ");
    element.before("");
    const anchor = element.previousSibling;
    element.remove();
    const cache = [];
    const getter = meta.__function(arrayExpression, ...scopes);
    meta.x.connected(() => effect(() => {
      const array = getter(element, ...scopes);
      if (typeof array?.[Symbol.iterator] != "function")
        error`transform-for-${arrayExpression}-not-iterable`;
      while (cache.length > array.length)
        cache.pop()[1].map((node2) => node2.remove());
      let index = -1;
      for (const item of array) {
        index++;
        if (cache[index] && cache[index][0] === item)
          continue;
        const node2 = meta.__render(
          element.localName == "template" ? element.content : element,
          ...scopes,
          [initializer, item]
        );
        cache[index]?.[1].map((node3) => node3.remove());
        cache[index] = [item, node2.nodeType == 11 ? [...node2.childNodes] : [node2]];
        (cache[index - 1]?.[1].at(-1) ?? anchor).after(...cache[index][1]);
      }
    }));
  });

  // src/transforms/02-if-else.js
  define.transform(2, (node, scopes, meta, context) => {
    if (node.nodeType != 2)
      return;
    if (node.name == "#else-if" || node.name == "#else")
      warn`transform-if-found-loose-${node.name}`;
    if (node.name != "#if")
      return;
    node.ownerElement.before("");
    const anchor = node.ownerElement.previousSibling;
    const expressions = [];
    const ifElseChain = [];
    let logicNode = anchor;
    const consume = (statement) => {
      if (!logicNode.nextElementSibling?.hasAttribute(statement))
        return;
      logicNode = logicNode.nextElementSibling;
      expressions.push(`()=>(${logicNode.getAttribute(statement) || true})`);
      ifElseChain.push(logicNode.localName == "template" ? logicNode.content : logicNode);
      logicNode.removeAttribute(statement);
      return true;
    };
    consume("#if");
    while (consume("#else-if"))
      ;
    consume("#else");
    while (anchor.nextSibling != logicNode)
      anchor.nextSibling.remove();
    logicNode.remove();
    let connectedIndex;
    const getter = meta.__function(`[${expressions}].findIndex(e=>e())`, ...scopes);
    const connectedNodes = [];
    meta.x.connected(() => effect(() => {
      const index = getter(null, ...scopes);
      if (index == connectedIndex)
        return;
      connectedIndex = index;
      connectedNodes.splice(0).map((node3) => node3.remove());
      if (!ifElseChain[index])
        return;
      const node2 = meta.__render(ifElseChain[index], ...scopes);
      connectedNodes.push(...node2.nodeType == 11 ? node2.childNodes : [node2]);
      anchor.after(...connectedNodes);
    }));
  });

  // src/transforms/03-attributes.js
  define.transform(3, (node, scopes, meta, context) => {
    if (node.nodeType != 2)
      return;
    if (node.name[0] != ":")
      return;
    const element = node.ownerElement;
    const name = node.name.slice(1);
    element.removeAttribute(node.name);
    const getter = meta.__function(node.value, ...scopes);
    meta.x.connected(() => effect(() => {
      const value = getter(element, ...scopes);
      if (value == null)
        element.removeAttribute(name);
      else
        element.setAttribute(name, value);
    }));
  });

  // src/transforms/04-properties.js
  define.transform(4, (node, scopes, meta, context) => {
    if (node.nodeType != 2)
      return;
    if (node.name[0] != ".")
      return;
    const element = node.ownerElement;
    element.removeAttribute(node.name);
    const originalLast = node.name.slice(1).split(".").at(-1);
    const chain = node.name.slice(1).split(".").map(camelCase);
    const getter = meta.__function(node.value || true, ...scopes);
    meta.x.connected(() => effect(() => {
      const value = getter(element, ...scopes);
      let current = element;
      const properties = [...chain];
      const last = properties.pop();
      for (const property of properties)
        current = current?.[property];
      if (current == null)
        return;
      if (current instanceof DOMTokenList)
        current.toggle(originalLast, value);
      else
        current[last] = value;
    }));
  });

  // src/transforms/05-events.js
  define.transform(5, (node, scopes, meta, context) => {
    if (node.nodeType != 2)
      return;
    if (node.name[0] != "@")
      return;
    const element = node.ownerElement;
    const type = node.name.slice(1);
    element.removeAttribute(node.name);
    const handler = meta.__function(node.value, ...scopes, ["event"]);
    meta.x.connected(() => when(element).does(type).then((event) => {
      monitor.ignore(() => handler(element, ...scopes, ["event", event]));
    }));
  });

  // src/index.js
  self.yozo = {
    monitor,
    until,
    Flow,
    live,
    when,
    purify,
    effect,
    frame,
    interval,
    paint,
    timeout
  };
  Object.defineProperty(self.yozo, "register", { value: register });
})();
