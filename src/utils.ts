import * as React from 'react';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import type { DebouncedFunc } from 'lodash';

import { OnRefChangeType, Props } from './types';

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
export const useCallbackRef =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <T extends (...args: any[]) => any>(callback: T | undefined): T => {
    const callbackRef = React.useRef(callback);

    React.useEffect(() => {
      callbackRef.current = callback;
    });

    return React.useMemo(() => ((...args) => callbackRef.current?.(...args)) as T, []);
  };

/** `useRef` hook doesn't handle conditional rendering or dynamic ref changes.
 * This hook creates a proxy that ensures that `refElement` is updated whenever the ref is changed. */
export const useRefProxy =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <T extends HTMLElement = any>(targetRef: React.MutableRefObject<T | null> | undefined) => {
    // we are going to use this ref to store the last element that was passed to the hook
    const [refElement, setRefElement] = React.useState<T | null>(targetRef?.current || null);

    // if targetRef is passed, we need to update the refElement
    // we have to use setTimeout because ref get assigned after the hook is called
    // in the future releases we are going to remove targetRef and force users to use ref returned by the hook
    if (targetRef) {
      setTimeout(() => {
        if (targetRef.current !== refElement) {
          setRefElement(targetRef.current);
        }
      }, 0);
    }

    // this is a memo that will be called every time the ref is changed
    // This proxy will properly call setState either when the ref is called as a function or when `.current` is set
    // we call setState inside to trigger rerender
    const refProxy: OnRefChangeType<T> = React.useMemo(
      () =>
        new Proxy(
          node => {
            if (node !== refElement) {
              setRefElement(node);
            }
          },
          {
            get(target, prop) {
              if (prop === 'current') {
                return refElement;
              }
              return target[prop];
            },
            set(target, prop, value) {
              if (prop === 'current') {
                setRefElement(value);
              } else {
                target[prop] = value;
              }
              return true;
            }
          }
        ),
      [refElement]
    );

    return { refProxy, refElement, setRefElement };
  };

/** Calculates the dimensions of the element based on the current box model.
 * @see https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model
 */
export const getDimensions = (entry: ResizeObserverEntry, box: ResizeObserverBoxOptions | undefined) => {
  // Value	          Border	  Padding	  Inner Content
  // ---------------------------------------------------
  // 'border-box'	    Yes	      Yes	      Yes
  // 'content-box'	  No	      No	      Yes
  //  undefined       No	      No?	      Yes

  if (box === 'border-box') {
    return {
      width: entry.borderBoxSize[0].inlineSize,
      height: entry.borderBoxSize[0].blockSize
    };
  }

  if (box === 'content-box') {
    return {
      width: entry.contentBoxSize[0].inlineSize,
      height: entry.contentBoxSize[0].blockSize
    };
  }

  return {
    width: entry.contentRect.width,
    height: entry.contentRect.height
  };
};
