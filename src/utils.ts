import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import type { DebouncedFunc } from 'lodash';

import { Props } from './types';

export type PatchedResizeObserverCallback = DebouncedFunc<ResizeObserverCallback> | ResizeObserverCallback;

export const patchResizeCallback = (
  resizeCallback: ResizeObserverCallback,
  refreshMode: Props['refreshMode'],
  refreshRate: Props['refreshRate'],
  refreshOptions: Props['refreshOptions']
): PatchedResizeObserverCallback => {
  switch (refreshMode) {
    case 'debounce':
      return debounce(resizeCallback, refreshRate, refreshOptions);
    case 'throttle':
      return throttle(resizeCallback, refreshRate, refreshOptions);
    default:
      return resizeCallback;
  }
};
