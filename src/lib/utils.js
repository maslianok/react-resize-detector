import { debounce, throttle } from 'lodash';

export const isFunction = fn => typeof fn === 'function';

export const listHandle = {
  debounce,
  throttle,
};

export const getHandle = (type) => {
  const handle = listHandle[type];
  if (!isFunction(handle)) {
    return false;
  }
  return handle;
};

export const checkIsHaveWindow = () => typeof window !== 'undefined';
