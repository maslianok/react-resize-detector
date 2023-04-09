import { useEffect, useState, useRef, useCallback } from 'react';
import type { DebouncedFunc } from 'lodash';

import { patchResizeCallback } from './utils';

import type {
  OnRefChangeType,
  ReactResizeDetectorDimensions,
  UseResizeDetectorReturn,
  useResizeDetectorProps
} from './types';

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

  // this is a callback that will be called every time the ref is changed
  // we call setState inside to trigger rerender
  const onRefChange: OnRefChangeType = useCallback(
    (node: T | null) => {
      if (node !== refElement) {
        setRefElement(node);
      }
    },
    [refElement]
  );
  // adding `current` to make it compatible with useRef shape
  onRefChange.current = refElement;

  useEffect(() => {
    return () => {
      // component is unmounted
      // clear ref to avoid memory leaks
      setRefElement(null);
      onRefChange.current = null;
    };
  }, []);

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

  const resizeCallback: ResizeObserverCallback = useCallback(
    (entries: ResizeObserverEntry[]) => {
      if (!handleWidth && !handleHeight) return;

      if (skipResize.current) {
        skipResize.current = false;
        return;
      }

      entries.forEach(entry => {
        const { width, height } = entry?.contentRect || {};
        setSize(prevSize => {
          if (!shouldSetSize(prevSize, { width, height })) return prevSize;
          return { width, height };
        });
      });
    },
    [handleWidth, handleHeight, skipResize, shouldSetSize]
  );

  const resizeHandler = useCallback(patchResizeCallback(resizeCallback, refreshMode, refreshRate, refreshOptions), [
    resizeCallback,
    refreshMode,
    refreshRate,
    refreshOptions
  ]);

  // on refElement change
  useEffect(() => {
    let resizeObserver: ResizeObserver | undefined;
    if (refElement) {
      resizeObserver = new window.ResizeObserver(resizeHandler);
      resizeObserver.observe(refElement, observerOptions);
    } else {
      if (size.width || size.height) {
        setSize({ width: undefined, height: undefined });
      }
    }

    return () => {
      resizeObserver?.disconnect?.();
      (resizeHandler as DebouncedFunc<ResizeObserverCallback>).cancel?.();
    };
  }, [resizeHandler, refElement]);

  useEffect(() => {
    onResize?.(size.width, size.height);
  }, [size]);

  return { ref: onRefChange, ...size };
}

export default useResizeDetector;
