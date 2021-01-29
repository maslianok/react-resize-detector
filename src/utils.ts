import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';

import { Props, ReactResizeDetectorDimensions } from './ResizeDetector';

export type patchResizeHandlerType = ReturnType<typeof debounce> | ReturnType<typeof throttle> | ResizeObserverCallback;

export const patchResizeHandler = (
  resizeCallback: ResizeObserverCallback,
  refreshMode: Props['refreshMode'],
  refreshRate: Props['refreshRate'],
  refreshOptions: Props['refreshOptions']
): patchResizeHandlerType => {
  switch (refreshMode) {
    case 'debounce':
      return debounce(resizeCallback, refreshRate, refreshOptions);
    case 'throttle':
      return throttle(resizeCallback, refreshRate, refreshOptions);
    default:
      return resizeCallback;
  }
};

export const isFunction = (fn: any): boolean => typeof fn === 'function';

export const isSSR = (): boolean => typeof window === 'undefined';

export const isDOMElement = (element: any): boolean => element instanceof Element || element instanceof HTMLDocument;

export const createNotifier = (
  onResize: Props['onResize'],
  setSize: React.Dispatch<React.SetStateAction<ReactResizeDetectorDimensions>>
) => ({ width, height }: ReactResizeDetectorDimensions): void => {
  if (onResize && isFunction(onResize)) {
    onResize(width, height);
  }

  setSize(prev => {
    if (prev.width === width && prev.height === height) {
      return prev;
    }
    return { width, height };
  });
};
