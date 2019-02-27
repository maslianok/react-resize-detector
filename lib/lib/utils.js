"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkIsHaveWindow = exports.getHandle = exports.listHandle = exports.isFunction = void 0;

var _debounce = _interopRequireDefault(require("lodash/debounce"));

var _throttle = _interopRequireDefault(require("lodash/throttle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isFunction = function isFunction(fn) {
  return typeof fn === 'function';
};

exports.isFunction = isFunction;
var listHandle = {
  debounce: _debounce.default,
  throttle: _throttle.default
};
exports.listHandle = listHandle;

var getHandle = function getHandle(type) {
  var handle = listHandle[type];

  if (!isFunction(handle)) {
    return false;
  }

  return handle;
};

exports.getHandle = getHandle;

var checkIsHaveWindow = function checkIsHaveWindow() {
  return typeof window !== 'undefined';
};

exports.checkIsHaveWindow = checkIsHaveWindow;