const { layer } = require("@fortawesome/fontawesome-svg-core")

const hasOwnProperty = Object.prototype.hasOwnProperty

// express start
function createApplication () {
  let app = function (req, res, next) {
    app.handle(req, res, next)
  }
  
  // some mixin operation here
  let appProto = createProto()
  mixin(app, appProto, false)
  
  // mount request field to the app instance, request is a new object, it's prototype is Node request
  app.request = Object.create(req, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })
  
  // mount response field to the app instance, request is a new object, it's prototype is Node response
  app.response = Object.create(res, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })
  
  // init config
  app.init()
  return app
}

function createProto () {
  let appProto = {}
  
  appProto.handle = function (req, res, next) {
    console.log('app.handle');
  }
  
  appProto.init = function () {
    // setting field
    this.cache = {};
    this.engines = {};
    this.settings = {};
    
    this.defaultConfiguration();
  }
  
  appProto.defaultConfiguration = function () {
    // some default settings here
  }
  
  appProto.use = function (fn) {
    // stepOne: get all middleware functions here
    
    // mock a middleware function
    let fns = [(req, res, next) => {}]
    
    // setpSec: setup router, add '_router' field to the prototype
    this.lazyrouter();
    
    let router = this._router
    
    fns.forEach(fn => {
      router.use((req, res, next) => {
        fn.handle(req, res, err => {
          console.log('handle err');
        })
      })
    }, this)
  }
  
  appProto.lazyrouter = function () {
    if (this._router) {
      this._router = new Router()
    }
  }
  
  return appProto
}

function mixin (target, copyObject, redefine = true) {
  Object.getOwnPropertyNames(copyObject).forEach(key => {
    if (!redefine && hasOwnProperty.call(dest, key)) {
      // Skip desriptor
      return
    }
    
    const descriptor = Object.getOwnPropertyDescriptor(copyObject, key)
    
    Object.defineProperty(target, key, descriptor)
  })
}

const app = createApplication()

// express end



// Router start

function Router () {
  let router = (req, res, next) => {
    router.handle(req, res, next);
  }
  
  let routeProto = createRouterProto()
  mixin(router, routeProto)
  
  // some config here
  this.stack = []
  
  return router
}

function createRouterProto () {
  let routeProto = {}
  
  // handle router.use(req, res, next) here
  routeProto.handle = function (req, res, next) {
    console.log('router handle');
  }
  
  routeProto.use = function (fn) {
    // stepOne: get middleware callback here
    // mock a middleware callback
    const callbacks = [(req, res, next) => {}]
    
    for (let i = 0; i < callbacks.length; i++) {
      const callback = callbacks[i]
      
      // view layer
      let layer = new layer()
      
      layer.route = undefined;
      
      // store every layer to the stack
      this.stack.push(layer);
    }
  }
}

// Router end


// Layer start

// description: Layer 是 express router 机制 底层的数据结构
function Layer (path, options, fn) {
  if (!(this instanceof Layer)) {
    return new Layer(path, options, fn);
  }
  
  let opts = options || {};
  
  // store router path and callback
  this.handle = fn;
  // if fn don't have name --> anonymous function
  this.name = fn.name || '<anonymous>';
  // TODO: why undefined
  this.path = undefined
}

// Layer end
