import debounce from "lodash-es/debounce";
import throttle from "lodash-es/throttle";
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