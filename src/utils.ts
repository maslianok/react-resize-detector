import * as React from 'react';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import type { DebouncedFunc } from 'lodash';

import { Props } from './types';

export type PatchedResizeObserverCallback = DebouncedFunc<ResizeObserverCallback> | ResizeObserverCallback;

/**
 * Wraps the resize callback with a lodash debounce / throttle based on the refresh mode
 */
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

/**
 * A custom hook that converts a callback to a ref to avoid triggering re-renders when passed as a
 * prop or avoid re-executing effects when passed as a dependency
 */
export function useCallbackRef<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (...args: any[]) => any
>(callback: T | undefined): T {
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  });

  // https://github.com/facebook/react/issues/19240
  return React.useMemo(() => ((...args) => callbackRef.current?.(...args)) as T, []);
}
