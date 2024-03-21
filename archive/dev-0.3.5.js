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
  var warn2 = printer((message) => console.warn(message));
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
    "monitor-$1-definition-should-be-class": (name) => `
		Registering "${name}", but its definition didn't look like a class.
		If this wasn't intentional, use monitor.register('${name}', class { \u2026 }) instead.`,
    "flow-stopped-but-triggered": () => `
		A flow was triggered after it stopped. Often, this indicates a memory leak.
		Make sure you use .cleanup(\u2026) to undo everything triggering the flow.`,
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
    "define-attribute-$1-is-type-bigint-instead-of-big-int": (attribute) => `
		Attribute "${attribute}" defined type "bigint". That should probably be "big-int".
		Other valid types are "string", "boolean", or "number".`,
    "define-attribute-$1-type-$2-unknown": (attribute, type) => `
		Attribute "${attribute}" defined unknown type "${type}".
		Valid types are "string", "boolean", "number", and "big-int"`,
    "define-attribute-$1-type-$2-does-not-exist": (attribute, type) => `
		Attribute "${attribute}" defined type "${type}", but that doesn't exist.
		The type attribute is converted to PascalCase, and that must be a global.`,
    "transform-for-$1-not-iterable": (expression) => `
		Expression "${expression}" in #for is not iterable.`,
    "transform-for-and-if-simultaneously": () => `
		Found a #for and #if attribute on the same element. This is ambiguous.
		Instead, use a wrapper <template #for="\u2026"> or <template #if="">.`,
    "transform-if-found-loose-$1": (statement) => `
		Found an "${statement}" attribute without an #if.
		Make sure the element follows an element with an #if or #else-if.`,
    "transform-mixing-class-and-class-list": () => `
		Found both a .class-list and a :class attribute on a single element.
		:class overwrites all classes when it updates, so mixing them is not advised.`,
    "transform-elseif-instead-of-else-if": () => `
		Found an "#elseif" attribute; that should probably be "#else-if".`,
    "transform-loose-flow-control-$1": (flowControl) => `
		Found an unrecognized flow control attribute "${flowControl}".
		It's okay to have it, but it'll be ignored.`,
    "transform-for-without-of": () => `
		Found a #for without " of ", which is the only type of #for expression supported.
		If you need to loop over numbers, generate an array of numbers and iterate that.`
  };

  // src/flow.js
  var Flow = class {
    #steps = [];
    #cleanup = [];
    #stopping;
    #stopIndex;
    constructor(callback) {
      monitor.add("undo", () => this.stop());
      callback?.((...args) => {
        if (!this.#steps)
          warn2`flow-stopped-but-triggered`;
        this.now(...args);
      });
    }
    flow(callback) {
      this.#steps?.push(callback);
      return this;
    }
    now(...args) {
      let index = -1;
      const next = () => {
        if (!this.#steps)
          return;
        index++;
        if (index < this.#stopIndex)
          return;
        if (this.#stopping)
          this.#stopIndex = index + 1;
        if (this.#steps.length + 1 == this.#stopIndex)
          this.stop();
        this.#steps?.[index]?.(next, ...args);
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
      if (this.#steps)
        this.#cleanup.splice(0).map((callback) => callback());
      this.#steps = null;
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
      if (this.#steps)
        this.#cleanup.push(callback);
      else
        callback();
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

  // src/utils.js
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
      warn2`when-${property}-instead-of-${type}-mistake`;
    return source[property] ?? source.does.bind(null, property.replace(/s$/, ""));
  } });

  // src/effect.js
  var effect = (callback, schedule = queueMicrotask) => {
    let call;
    const run = () => schedule(() => flow.now());
    const flow = new Flow().then(() => {
      call?.undo();
      call = monitor(["undo", "live"], callback);
      call.live.addEventListener("change", run, { once: true });
    }).cleanup(() => {
      call?.undo();
      call?.live.removeEventListener("change", run, { once: true });
    });
    run();
    return flow;
  };

  // src/live.js
  var live = (thing) => new LiveCore({ __value: { $: live.get(thing) } }, "$").__$value;
  var coreMap = /* @__PURE__ */ new WeakMap();
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
          if (coreMap.has(this.__value?.[key2]))
            warnOnce`live-property-${key2}-doubled`;
          return this.__value?.[key2];
        },
        set: (target, key2, value) => {
          if (key2[0] == "$")
            warn2`live-property-set-${key2}-has-$`;
          return live.set(this.__cached(key2).__$value, value);
        },
        deleteProperty: (target, key2, value) => {
          if (key2[0] == "$")
            warn2`live-property-delete-${key2}-has-$`;
          return live.delete(this.__cached(key2).__$value);
        },
        has: (target, key2) => {
          monitor.add("live", this.__$value, "keychange");
          return this.__value != null && key2 in this.__value || target[key2];
        },
        ownKeys: () => {
          monitor.add("live", this.__$value, "keychange");
          return Object.keys(this.__value ?? {}).map((key2) => `$${key2}`);
        },
        getOwnPropertyDescriptor: () => ({ configurable: true, enumerable: true }),
        // Not allowed!
        defineProperty: () => false
      });
      coreMap.set(this.__$value, this);
      this.__value = this.__parent.__value?.[this.__key];
      this.__keys = Object.keys(this.__value ?? {});
    }
    __cached(key) {
      return this.__cache[key] ??= new LiveCore(this, key, this.__root);
    }
    // Here is where we make changes and compare states to what things were before
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
    const core = coreMap.get($live);
    if (!core)
      return key == null ? $live : $live[key];
    access(key == null ? core.__key : key);
    if (key != null) {
      if (coreMap.has(core.__cached(key).__value))
        warnOnce`live-property-${key}-doubled`;
      return core.__cached(key).__value;
    }
    monitor.add("live", $live, "deepchange");
    if (coreMap.has(core.__value))
      warnOnce`live-property-${key}-doubled`;
    return core.__value;
  };
  live.set = ($live, value) => {
    const core = coreMap.get($live);
    return !!core?.__alter(() => {
      if (core.__parent.__value == null)
        return false;
      core.__parent.__value[core.__key] = live.get(value);
      return true;
    });
  };
  live.delete = ($live, value) => {
    const core = coreMap.get($live);
    return !!core?.__alter(() => {
      if (core.__parent.__value == null)
        return false;
      return delete core.__parent.__value[core.__key];
    });
  };
  live.link = ($live, thing) => {
    if (!coreMap.has($live))
      if (access.recent)
        error`live-link-target-${access.recent}-not-live`;
      else
        error`live-link-target-not-live`;
    let cache;
    let options = thing;
    if (self.HTMLElement && thing instanceof HTMLElement) {
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
    const listener = () => {
      if (changing)
        return;
      if (!options.set)
        return change(cache);
      options.set(monitor.ignore(() => live.get($live)));
      change(monitor.ignore(options.get));
    };
    $live.addEventListener("deepchange", listener);
    change(monitor.ignore(options.get));
    return (options.changes ?? new Flow()).then(() => change(monitor.ignore(options.get))).if(() => null).cleanup(() => $live.removeEventListener("deepchange", listener));
  };

  // src/monitor.js
  var context;
  var monitor = (names, callback) => {
    const before = context;
    context = {};
    const call = {};
    names.map((name) => {
      context[name] = new registrations[name]();
      call[name] = context[name].result;
    });
    call.result = callback();
    context = before;
    return call;
  };
  var until = (thing) => {
    if (!context)
      return thing;
    return new Promise(async (resolve) => {
      const before = context;
      const result = await thing;
      if (Object.keys(before).some((name) => before[name].until?.()))
        return;
      queueMicrotask(() => context = before);
      resolve(result);
      queueMicrotask(() => context = null);
    });
  };
  monitor.ignore = (callback) => monitor([], callback).result;
  monitor.add = (name, ...things) => {
    if (!registrations[name])
      warn2`monitor-add-${name}-not-in-registry`;
    context?.[name]?.add(...things);
  };
  monitor.register = (name, registration) => {
    if (name == "result")
      warn2`monitor-cannot-register-result`;
    if (registrations[name])
      warn2`monitor-registry-already-has-${name}`;
    if (!registration?.toString().startsWith("class "))
      warn2`monitor-${name}-definition-should-be-class`;
    registrations[name] ??= registration;
  };
  var registrations = {
    // Prevent "result" from being registered because it's already used
    // for the return value of monitored calls
    result: true,
    // Monitor cleanup functions
    undo: class {
      #callbacks = [];
      #stopped;
      // This is what'll be returned from the monitor() calls
      result = () => {
        if (this.#stopped)
          return;
        this.#callbacks.splice(0).map((callback) => callback());
        this.#stopped = true;
      };
      // add() is the only required method for these classes
      // The registrations would be kinda useless without it anyway
      add(callback) {
        if (this.#stopped)
          return callback();
        this.#callbacks.push(callback);
      }
      // Stop until() calls from continuing if the call has been undone
      until() {
        return this.#stopped;
      }
    },
    // Monitor use of live variables for different event types
    live: class {
      // Cache of live variable to array of used types
      #cache = /* @__PURE__ */ new Map();
      result = new EventTarget();
      add($live, type) {
        const cache = this.#cache.get($live) ?? [];
        if (cache.includes(type))
          return;
        cache.push(type);
        this.#cache.set($live, cache);
        $live.addEventListener(
          type,
          () => this.result.dispatchEvent(new CustomEvent("change"))
        );
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
    const context2 = {
      // The exposed properties to be used in the component logic
      x: /* @__PURE__ */ new Set(["query", "$"]),
      // A lookup map: component instance -> metadata
      // We basically dump all instance-related things in there
      __meta: /* @__PURE__ */ new WeakMap(),
      __body: class extends HTMLElement {
        constructor() {
          super();
          context2.__meta.set(this, { x: {} });
          monitor.ignore(() => composed.constructor.call(this, context2.__meta.get(this)));
        }
      }
    };
    const calls = {};
    definer(Object.fromEntries(
      registrations2.map(([mod, name]) => [name, (...args) => (calls[name] ??= []).push(args)])
    ));
    const composed = compose(
      registrations2.map(([mod, name]) => mod(context2, calls[name] ?? []))
    );
    Object.entries(composed).map(([key, callback]) => {
      return context2.__body.prototype[key] ??= function(...args) {
        return monitor.ignore(() => callback.call(this, context2.__meta.get(this), ...args));
      };
    });
    customElements.define(context2.__title, context2.__body);
    return customElements.whenDefined(context2.__title);
  };
  var registrations2 = [];
  define.register = (priority, name, mod) => {
    registrations2.push([mod, name, priority]);
    registrations2.sort((a, b) => a[2] - b[2]);
  };

  // src/register.js
  var registered = /* @__PURE__ */ new Set();
  var register = async (url) => {
    if (registered.has(`${url}`))
      return;
    registered.add(`${url}`);
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
  var cancelled;
  var autoRegistered;
  register.auto = (find) => {
    if (autoRegistered)
      return;
    autoRegistered = /* @__PURE__ */ new Set();
    const autoDefine = (name) => {
      if (autoRegistered.has(name))
        return;
      autoRegistered.add(name);
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
    define.register(6, Symbol(), (context2) => {
      if (cancelled)
        return {};
      if (context2.__template)
        from(context2.__template);
      return {};
    }, {});
    return when(document).observes("mutation", { childList: true, subtree: true }).then(() => from(document)).now().if(() => null).cleanup(() => cancelled = true);
  };

  // src/mods/00-title.js
  define.register(0, "title", (context2, [args]) => {
    if (!args?.[1])
      error`define-missing-title`;
    context2.__title = args[1];
    return {};
  });

  // src/mods/01-meta.js
  define.register(1, "meta", (context2, argslist) => {
    const attributes = argslist.filter((args) => args[0].attribute);
    const properties = [
      ...argslist.filter((args) => args[0].property),
      ...attributes.filter((args) => args[0].type).map((args) => [{ property: args[0].as ?? camelCase(args[0].attribute) }]),
      ...argslist.filter((args) => args[0].method).map((args) => [{ property: args[0].method, readonly: true }])
    ];
    properties.map(([options]) => {
      const get = function() {
        return monitor.ignore(() => live.get(context2.__meta.get(this).x.$, options.property));
      };
      Object.defineProperty(
        context2.__body.prototype,
        options.property,
        "readonly" in options ? { get } : { get, set: function(value) {
          context2.__meta.get(this).x.$[options.property] = value;
        } }
      );
    });
    context2.__body.observedAttributes = attributes.map((args) => args[0].attribute);
    context2.__body.formAssociated = argslist.some((args) => args[0].formAssociated != null);
    const constructor = function(meta) {
      meta.x.$ = live({ attributes: {} });
      attributes.map(([options]) => {
        const name = camelCase(options.attribute);
        meta.x.$.$attributes[name] = null;
        meta.x.$.$attributes[`$${name}`].addEventListener("change", () => {
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
          if (options.type == "bigint")
            warn`define-attribute-${options.attribute}-is-type-bigint-instead-of-big-int`;
          else if (!["boolean", "string", "number", "big-int"].includes(options.type))
            warn`define-attribute-${options.attribute}-type-${options.type}-unknown`;
          else if (!type)
            error`define-attribute-${options.attribute}-type-${options.type}-does-not-exist`;
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
  define.register(2, "meta", (context2, argslist) => {
    return compose([
      ...argslist,
      [{ hook: "connected", unhook: "disconnected" }],
      [{ hook: "disconnected" }]
    ].map((args) => {
      const { hook, unhook } = args[0];
      if (!hook)
        return {};
      const items = Symbol();
      const queuedArgs = Symbol();
      context2.x.add(hook);
      const constructor = function(meta) {
        meta.x[hook] = (callback) => {
          const item = [new Flow().then((...args2) => {
            item[1]?.undo();
            item[1] = monitor(["undo"], () => callback?.(...args2));
          }).cleanup(() => {
            item[1]?.undo();
            meta[items].delete(item);
          })];
          meta[items].add(item);
          if (meta[queuedArgs])
            queueMicrotask(() => item[0].now(...meta[queuedArgs]));
          return item[0];
        };
        meta[items] = /* @__PURE__ */ new Set();
      };
      const hookCallback = function(meta, ...args2) {
        meta[queuedArgs] = args2;
        for (const item of meta[items])
          item[0].now(...args2);
      };
      if (!unhook)
        return { constructor, [`${hook}Callback`]: hookCallback };
      return {
        constructor,
        [`${hook}Callback`]: hookCallback,
        [`${unhook}Callback`]: function(meta, ...args2) {
          meta[queuedArgs] = null;
          for (const item of meta[items])
            item[1]?.undo();
        }
      };
    }));
  });

  // src/mods/03-transforms.js
  define.register(3, Symbol(), (context2) => {
    const transformsMap = /* @__PURE__ */ new Map();
    const getTransforms = (root, ...scopeNames) => {
      if (transformsMap.get(root))
        return transformsMap.get(root);
      const transforms = [];
      transformsMap.set(root, transforms);
      const iterator = document.createNodeIterator(root, 5);
      let node;
      while (node = iterator.nextNode()) {
        if (node.nodeType == 3) {
          const parts = node.textContent.split(/{{([^]*?)}}/g);
          node.after(...parts);
          node.remove();
          transforms.push(...parts.map((part, index) => {
            node = iterator.nextNode();
            if (index % 2 == 0)
              return;
            const getter = new Function(...scopeNames, `return(${part})`);
            return (meta, clone, scopes) => effect(() => {
              clone.textContent = getter(...scopes.map((scope) => scope[1]));
            });
          }));
        } else if (node.getAttribute("#for")) {
          if (!node.getAttribute("#for").includes(" of "))
            error`transform-for-without-of`;
          if (node.hasAttribute("#if"))
            error`transform-for-and-if-simultaneously`;
          const [scopeName, expression] = node.getAttribute("#for").split(" of ");
          node.before("");
          node.removeAttribute("#for");
          node.remove();
          const element = node.localName == "template" ? node.content : node;
          const getter = new Function(...scopeNames, `return(${expression})`);
          transforms.push((meta, clone, scopes) => {
            const cache = [];
            monitor.add("undo", () => cache.splice(0).map((item) => item[1].undo()));
            effect(() => {
              const array = true ? (() => {
                const value = getter(...scopes.map((scope) => scope[1]));
                if (typeof value[Symbol.iterator] == "function")
                  return [...value];
                error`transform-for-${expression}-not-iterable`;
              })() : (
                //
                [...getter(...scopes.map((scope) => scope[1]))]
              );
              while (cache.length > array.length)
                cache.pop()[1].undo();
              array.map((item, index) => {
                if (cache[index] && cache[index][0] === item)
                  return;
                cache[index]?.[1].undo();
                cache[index] = [item, monitor(["undo"], () => {
                  const rendered = meta.__render(element, [...scopes, [scopeName, item]]);
                  const nodes = rendered.nodeType == 11 ? [...rendered.childNodes] : [rendered];
                  monitor.add("undo", () => nodes.map((node2) => node2.remove()));
                  (cache[index - 1]?.[1].result.at(-1) ?? clone).after(...nodes);
                  return nodes;
                })];
              });
            });
          });
        } else if (node.getAttribute("#if")) {
          node.before("");
          const anchor = node.previousSibling;
          const expressions = [];
          const chain = [];
          const consume = (attribute) => {
            const element = anchor.nextElementSibling;
            if (!element?.hasAttribute(attribute))
              return;
            while (anchor.nextSibling != element)
              anchor.nextSibling.remove();
            expressions.push(`()=>(${element.getAttribute(attribute) || true})`);
            chain.push(element.localName == "template" ? element.content : element);
            element.removeAttribute(attribute);
            element.remove();
            return true;
          };
          consume("#if");
          while (consume("#else-if"))
            ;
          consume("#else");
          const getter = new Function(...scopeNames, `return[${expressions}].findIndex(e=>e())`);
          transforms.push((meta, clone, scopes) => {
            let connectedIndex;
            const connected = [];
            monitor.add("undo", () => connected.splice(0).map((node2) => node2.remove()));
            effect(() => {
              const index = getter(...scopes.map((scope) => scope[1]));
              if (index == connectedIndex)
                return;
              connectedIndex = index;
              connected.splice(0).map((node2) => node2.remove());
              if (!chain[index])
                return;
              const rendered = meta.__render(chain[index], scopes);
              const nodes = rendered.nodeType == 11 ? rendered.childNodes : [rendered];
              connected.push(...nodes);
              clone.after(...nodes);
            });
          });
        } else {
          const looseElse = [...node.attributes].find(({ name }) => ["#else-if", "#else"].includes(name))?.name;
          if (looseElse)
            warn2`transform-if-found-loose-${looseElse}`;
          if (node.hasAttribute("#elseif"))
            warn2`transform-elseif-instead-of-else-if`;
          const looseFlowControl = [...node.attributes].find(({ name }) => name.startsWith("#"))?.name;
          if (looseFlowControl)
            warn2`transform-loose-flow-control-${looseFlowControl}`;
          const usesClassList = [...node.attributes].some(({ name }) => name.startsWith(".class-list"));
          if (node.hasAttribute(":class") && usesClassList)
            warn2`transform-mixing-class-and-class-list`;
          const shorthands = [...node.attributes].map((attribute) => {
            if (attribute.name[0] == ":") {
              const name = attribute.name.slice(1);
              const getter = new Function(...scopeNames, `return(${attribute.value})`);
              node.removeAttribute(attribute.name);
              return (meta, clone, scopes) => effect(() => {
                const value = getter.call(clone, ...scopes.map((scope) => scope[1]));
                if (value == null)
                  clone.removeAttribute(name);
                else
                  clone.setAttribute(name, value);
              });
            } else if (attribute.name[0] == ".") {
              const last = attribute.name.slice(1).split(".").at(-1);
              const chain = attribute.name.slice(1).split(".").map(camelCase);
              const getter = new Function(...scopeNames, `return(${attribute.value})`);
              node.removeAttribute(attribute.name);
              return (meta, clone, scopes) => effect(() => {
                const value = getter.call(clone, ...scopes.map((scope) => scope[1]));
                const properties = [...chain];
                const tail = properties.pop();
                let current = clone;
                properties.map((property) => current = current?.[property]);
                if (current == null)
                  return;
                if (current instanceof DOMTokenList)
                  current.toggle(last, value);
                else
                  current[tail] = value;
              });
            } else if (attribute.name[0] == "@") {
              const type = attribute.name.slice(1);
              const getter = new Function(...scopeNames, "event", attribute.value);
              node.removeAttribute(attribute.name);
              return (meta, clone, scopes) => {
                const handler = (event) => monitor.ignore(
                  () => getter.call(clone, ...scopes.map((scope) => scope[1]), event)
                );
                clone.addEventListener(type, handler);
                monitor.add("undo", () => clone.removeEventListener(type, handler));
              };
            }
          });
          transforms.push((...args) => {
            shorthands.map((shorthand) => shorthand?.(...args));
          });
        }
      }
      return transforms;
    };
    const constructor = function(meta) {
      meta.__render = (tree, scopes, scheduler = (update) => update()) => {
        const transforms = getTransforms(tree, ...scopes.map((scope) => scope[0]));
        const clone = tree.cloneNode(true);
        const iterator = document.createNodeIterator(clone, 5);
        const pairs = transforms.map((transform) => [iterator.nextNode(), transform]).filter(([node, transform]) => transform);
        scheduler(() => {
          pairs.map((pair) => pair[1](meta, pair[0], scopes));
        });
        return clone;
      };
    };
    return { constructor };
  });

  // src/mods/05-template.js
  define.register(5, "template", (context2, [args]) => {
    if (!args) {
      return {
        constructor: function(meta) {
          meta.root = this;
        }
      };
    }
    const template = document.createElement("template");
    template.innerHTML = args[1];
    context2.__template = template.content;
    if (args[0].mode) {
      return {
        constructor: function(meta) {
          meta.root = this.attachShadow(args[0]);
          meta.root.append(meta.__render(
            context2.__template,
            [[`{${[...context2.x]}}`, meta.x]],
            meta.x.connected
          ));
          customElements.upgrade(meta.root);
        }
      };
    }
    return {
      constructor: function(meta) {
        meta.root = meta.__render(
          context2.__template,
          [[`{${[...context2.x]}}`, meta.x]],
          meta.x.connected
        );
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
  define.register(7, Symbol(), (context2) => {
    const constructor = function(meta) {
      meta.x.query = (selector) => meta.root.querySelector(selector);
      meta.x.query.all = (selector) => [...meta.root.querySelectorAll(selector)];
    };
    return { constructor };
  });

  // src/mods/08-style.js
  define.register(8, "style", (context2, [args]) => {
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
  define.register(10, "script", (context2, [args]) => {
    if (!args)
      return {};
    const callback = new Function(
      `{${[...context2.x]}}`,
      `const{${Object.keys(self.yozo)}}=self.yozo;${args[1]}`
    );
    return {
      constructor: function(meta) {
        callback.call(this, meta.x);
      }
    };
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
