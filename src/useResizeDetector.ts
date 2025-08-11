import { useEffect, useState, useRef, useCallback } from 'react';
import type { DebouncedFunc } from 'lodash';

import { getDimensions, patchResizeCallback, useCallbackRef, useRefProxy } from './utils.js';

import type { Dimensions, UseResizeDetectorReturn, useResizeDetectorProps } from './types.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useResizeDetector<T extends HTMLElement = any>({
  skipOnMount = false,
  refreshMode,
  refreshRate = 1000,
  refreshOptions,
  handleWidth = true,
  handleHeight = true,
  targetRef,
  observerOptions,
  onResize,
  disableRerender = false,
}: useResizeDetectorProps<T> = {}): UseResizeDetectorReturn<T> {
  // If `skipOnMount` is enabled, skip the first resize event
  const skipResize = useRef<boolean>(skipOnMount);

  // Wrap the `onResize` callback with a ref to avoid re-renders
  const onResizeRef = useCallbackRef(onResize);

  const [size, setSize] = useState<Dimensions>({
    width: undefined,
    height: undefined,
  });

  const sizeRef = useRef<Dimensions>({
    width: undefined,
    height: undefined,
  });

  // Create a proxy ref to handle conditional rendering and dynamic ref changes of the target element
  const { refProxy, refElement } = useRefProxy<T>(targetRef);

  const { box } = observerOptions || {};

  const resizeCallback: ResizeObserverCallback = useCallback(
    (entries: ResizeObserverEntry[]) => {
      if (!handleWidth && !handleHeight) return;

      if (skipResize.current) {
        skipResize.current = false;
        return;
      }

      // Only update the size if one of the observed dimensions has changed
      const shouldSetSize = (prevSize: Dimensions, nextSize: Dimensions) =>
        (handleWidth && prevSize.width !== nextSize.width) || (handleHeight && prevSize.height !== nextSize.height);

      entries.forEach((entry) => {
        const dimensions = getDimensions(entry, box);
        if(disableRerender) {
          if(shouldSetSize(sizeRef.current, dimensions)) {
            sizeRef.current.width = dimensions.width;
            sizeRef.current.height = dimensions.height;
            onResizeRef?.({
              width: dimensions.width,
              height: dimensions.height,
              entry,
            });
          }
        } else {
          setSize((prevSize) => {
            if (!shouldSetSize(prevSize, dimensions)) return prevSize;
              onResizeRef?.({
                width: dimensions.width,
                height: dimensions.height,
                entry,
              });
            return dimensions;
          });
        }
      });
    },
    [handleWidth, handleHeight, skipResize, box, disableRerender],
  );

  // Throttle/Debounce the resize event if refreshMode is configured
  const resizeHandler = useCallback(patchResizeCallback(resizeCallback, refreshMode, refreshRate, refreshOptions), [
    resizeCallback,
    refreshMode,
    refreshRate,
    refreshOptions,
  ]);

  // Attach ResizeObserver to the element
  useEffect(() => {
    let resizeObserver: ResizeObserver | undefined;
    if (refElement) {
      try {
        resizeObserver = new window.ResizeObserver(resizeHandler);
        resizeObserver.observe(refElement, observerOptions);
      } catch (error) {
        console.warn('ResizeObserver not supported or failed to initialize:', error);
      }
    }
    // If refElement is not available, reset the size
    else if (size.width || size.height) {
      onResizeRef?.({
        width: null,
        height: null,
        entry: null,
      });
      sizeRef.current.width = undefined;
      sizeRef.current.height = undefined;
      if (!disableRerender) {
        setSize({ width: undefined, height: undefined });
      }
    }

    // Disconnect the ResizeObserver when the component is unmounted
    return () => {
      resizeObserver?.disconnect?.();
      (resizeHandler as DebouncedFunc<ResizeObserverCallback>).cancel?.();
    };
  }, [resizeHandler, refElement]);
  

  return { ref: refProxy, ...(disableRerender ? sizeRef.current : size) };
}

export default useResizeDetector;
