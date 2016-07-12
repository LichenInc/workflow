function Module(){
  this.scenes = {};
}

Module.prototype.register = function register(name, module) {
  if(this.scenes[name]){
    throw "Page " + name + "already registered";
  }
  this.scenes[name] = module;
  return this;
};

Module.prototype.get = function get(name) {
  if(!this.scenes[name]){
    throw "Page " + name + "not registered";
  }
  return this.scenes[name];
};


function ModuleLoader() {
  this.modules = {};
}

ModuleLoader.prototype.module = function module(name) {
  if(!this.modules[name]){
    this.modules[name] = new Module();
  }
  return this.modules[name];
};

module.exports = new ModuleLoader();
