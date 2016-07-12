let JSData = require('js-data');
let DSHttpAdapter = require('js-data-http');
let axios = require('axios');
import ExtendableError from 'es6-error'

class RequestError extends ExtendableError {
  constructor(request) {
    super(request.data.error ? request.data.error.message : request.data.message)
    this.request = request
  }
}

export class BadRequestRequestError extends RequestError { }
export class UnauthorizedRequestError extends RequestError { }
export class ForbiddenRequestError extends RequestError { }
export class NotFoundRequestError extends RequestError { }
export class UnprocessableEntityRequestError extends RequestError { }
export class InternalServerRequestError extends RequestError { }

let dsoptions = {
  watchChanges: false
}

if (process.env.NODE_ENV !== 'production') {
  dsoptions.debug = true;
} else {
  dsoptions.debug = false;
  dsoptions.log = false;
}

let store = new JSData.DS(dsoptions);

store.init = function(options, callback){
  let default_opts = {
    basePath: '/api'
  };

  let config = Object.assign(default_opts, options)

  let http = axios.create();

  http.interceptors.response.use(undefined, function (request) {
    switch(request.status) {
      case 400:
        request = new BadRequestRequestError(request)
        break
      case 401:
        request = new UnauthorizedRequestError(request)
        break
      case 403:
        request = new ForbiddenRequestError(request)
        break
      case 404:
        request = new NotFoundRequestError(request)
        break
      case 422:
        request = new UnprocessableEntityRequestError(request)
        break
      case 500:
        request = new InternalServerRequestError(request)
        break
    }
    return Promise.reject(request);
  });

  let httpoptions = {
    basePath: config.basePath,
    httpConfig: {
      baseURL: config.host
    },
    http: axios
  }

  if (process.env.NODE_ENV === 'production') {
    httpoptions.log = false;
  }

  store.registerAdapter('http', new DSHttpAdapter(httpoptions), { default: true });

  if(callback){
    callback(store)
  }
};

// Models
let models = {};

store.models = function(name){
  if(!models[name]){
    throw "Model " + name + " not registered";
  }
  return models[name];
};

store.registerModel =  function(name, model){
  if(models[name]){
    throw "Model " + name + " already registered";
  }
  models[name] = model;
  return store;
};

export default store
