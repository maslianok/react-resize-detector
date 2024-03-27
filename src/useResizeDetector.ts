import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import type { DebouncedFunc } from 'lodash';

import { patchResizeCallback } from './utils';

import type {
  OnRefChangeType,
  ReactResizeDetectorDimensions,
  UseResizeDetectorReturn,
  useResizeDetectorProps
} from './types';

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
  onResize
}: useResizeDetectorProps<T> = {}): UseResizeDetectorReturn<T> {
  const skipResize = useRef<boolean>(skipOnMount);

  const [size, setSize] = useState<ReactResizeDetectorDimensions>({
    width: undefined,
    height: undefined
  });

  // we are going to use this ref to store the last element that was passed to the hook
  const [refElement, setRefElement] = useState<T | null>(targetRef?.current || null);

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
  const refProxy: OnRefChangeType<T> = useMemo(
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

  // Only update the size if one of the observed dimensions has changed
  const shouldSetSize = useCallback(
    (prevSize: ReactResizeDetectorDimensions, nextSize: ReactResizeDetectorDimensions) => {
      if (prevSize.width === nextSize.width && prevSize.height === nextSize.height) {
        // skip if dimensions haven't changed
        return false;
      }

      if (
        (prevSize.width === nextSize.width && !handleHeight) ||
        (prevSize.height === nextSize.height && !handleWidth)
      ) {
        // process `handleHeight/handleWidth` props
        return false;
      }

      return true;
    },
    [handleWidth, handleHeight]
  );

  const box = observerOptions?.box;

  const resizeCallback: ResizeObserverCallback = useCallback(
    (entries: ResizeObserverEntry[]) => {
      if (!handleWidth && !handleHeight) return;

      if (skipResize.current) {
        skipResize.current = false;
        return;
      }

      // Calculates the dimensions of the element based on the current box model
      // Refs: https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model

      // Value	          Border	  Padding	  Inner Content
      // ---------------------------------------------------
      // 'border-box'	    Yes	      Yes	      Yes
      // 'content-box'	  No	      No	      Yes
      //  undefined       No	      No?	      Yes
      const getDimensions = (entry: ResizeObserverEntry) => {
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

      entries.forEach(entry => {
        const dimensions = getDimensions(entry);
        setSize(prevSize => {
          if (!shouldSetSize(prevSize, dimensions)) return prevSize;
          onResize?.({
            width: dimensions.width,
            height: dimensions.height,
            entry
          });
          return dimensions;
        });
      });
    },
    [handleWidth, handleHeight, skipResize, shouldSetSize, box]
  );

  // Throttle/Debounce the resize event if refreshMode is configured
  const resizeHandler = useCallback(patchResizeCallback(resizeCallback, refreshMode, refreshRate, refreshOptions), [
    resizeCallback,
    refreshMode,
    refreshRate,
    refreshOptions
  ]);

  // Attach ResizeObserver to the element
  useEffect(() => {
    let resizeObserver: ResizeObserver | undefined;
    if (refElement) {
      resizeObserver = new window.ResizeObserver(resizeHandler);
      resizeObserver.observe(refElement, observerOptions);
    }
    // If refElement is not available, reset the size
    else if (size.width || size.height) {
      onResize?.({
        width: null,
        height: null,
        entry: null
      });
      setSize({ width: undefined, height: undefined });
    }

    // Disconnect the ResizeObserver when the component is unmounted
    return () => {
      resizeObserver?.disconnect?.();
      (resizeHandler as DebouncedFunc<ResizeObserverCallback>).cancel?.();
    };
  }, [resizeHandler, refElement]);

  return { ref: refProxy, ...size };
}

export default useResizeDetector;
