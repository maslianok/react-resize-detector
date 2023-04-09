import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import type { DebouncedFunc } from 'lodash';

import { Props, ReactResizeDetectorDimensions } from './types';

export type PatchedResizeObserverCallback = DebouncedFunc<ResizeObserverCallback> | ResizeObserverCallback;

export const patchResizeHandler = (
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

export const isFunction = (fn: unknown): boolean => typeof fn === 'function';

export const isSSR = (): boolean => typeof window === 'undefined';

export const isDOMElement = (element: unknown): boolean =>
  element instanceof Element || element instanceof HTMLDocument;

export const createNotifier =
  (
    onResize: Props['onResize'],
    sizeRef: Readonly<React.MutableRefObject<ReactResizeDetectorDimensions>>,
    setSize: React.Dispatch<React.SetStateAction<ReactResizeDetectorDimensions>>,
    handleWidth: boolean,
    handleHeight: boolean
  ) =>
  ({ width, height }: ReactResizeDetectorDimensions): void => {
    const { current: prev } = sizeRef;

    if (prev.width === width && prev.height === height) {
      // skip if dimensions haven't changed
      return;
    }

    if ((prev.width === width && !handleHeight) || (prev.height === height && !handleWidth)) {
      // process `handleHeight/handleWidth` props
      return;
    }

    onResize?.(width, height);

    const newSize = { width, height };
    setSize(newSize);
  };
