import { debounce, throttle } from 'lodash';

export const listHandle = {
  debounce,
  throttle,
};

export const getHandle = type => listHandle[type];

export const isFunction = fn => typeof fn === 'function';

export const isSSR = () => typeof window === 'undefined';
