"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDOMElement = exports.isSSR = exports.isFunction = exports.getRefreshScheduler = exports.refreshSchedulers = void 0;

var _debounce = _interopRequireDefault(require("lodash/debounce"));

var _throttle = _interopRequireDefault(require("lodash/throttle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var refreshSchedulers = {
  debounce: _debounce["default"],
  throttle: _throttle["default"]
};
exports.refreshSchedulers = refreshSchedulers;

var getRefreshScheduler = function getRefreshScheduler(type) {
  return refreshSchedulers[type];
};

exports.getRefreshScheduler = getRefreshScheduler;

var isFunction = function isFunction(fn) {
  return typeof fn === 'function';
};

exports.isFunction = isFunction;

var isSSR = function isSSR() {
  return typeof window === 'undefined';
};

exports.isSSR = isSSR;

var isDOMElement = function isDOMElement(element) {
  return element instanceof Element || element instanceof HTMLDocument;
};

exports.isDOMElement = isDOMElement;