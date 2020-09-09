import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
export var listHandle = {
  debounce: debounce,
  throttle: throttle
};
export var getHandle = function getHandle(type) {
  return listHandle[type];
};
export var isFunction = function isFunction(fn) {
  return typeof fn === 'function';
};
export var isSSR = function isSSR() {
  return typeof window === 'undefined';
};
export var isDOMElement = function isDOMElement(element) {
  return element instanceof Element || element instanceof HTMLDocument;
};