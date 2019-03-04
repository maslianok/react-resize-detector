import debounce from "lodash-es/debounce";
import throttle from "lodash-es/throttle";
export var isFunction = function isFunction(fn) {
  return typeof fn === 'function';
};
export var listHandle = {
  debounce: debounce,
  throttle: throttle
};
export var getHandle = function getHandle(type) {
  var handle = listHandle[type];

  if (!isFunction(handle)) {
    return false;
  }

  return handle;
};
export var checkIsHaveWindow = function checkIsHaveWindow() {
  return typeof window !== 'undefined';
};