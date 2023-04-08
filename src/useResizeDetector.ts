import { useEffect, useState, useRef, useCallback } from 'react';
import type { DebouncedFunc } from 'lodash';

import { patchResizeHandler, createNotifier } from './utils';

import type { PatchedResizeObserverCallback } from './utils';
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

  const resizeHandler = useRef<PatchedResizeObserverCallback>();

  const [size, setSize] = useState<ReactResizeDetectorDimensions>({
    width: undefined,
    height: undefined
  });

  /**
   * To access the current size in the ResizeObserver without having to recreate it each time size updates.
   */
  const sizeRef = useRef(size);
  sizeRef.current = size;

  useEffect(() => {
    if (!handleWidth && !handleHeight) return;

    if (!refElement) {
      return;
    }

    const notifyResize = createNotifier(onResize, sizeRef, setSize, handleWidth, handleHeight);

    const resizeCallback: ResizeObserverCallback = (entries: ResizeObserverEntry[]) => {
      if (!handleWidth && !handleHeight) return;

      entries.forEach(entry => {
        const { width, height } = (entry && entry.contentRect) || {};

        const shouldSetSize = !skipResize.current;
        if (shouldSetSize) {
          notifyResize({ width, height });
        }

        skipResize.current = false;
      });
    };

    resizeHandler.current = patchResizeHandler(resizeCallback, refreshMode, refreshRate, refreshOptions);

    const resizeObserver = new window.ResizeObserver(resizeHandler.current);
    if (refElement) {
      resizeObserver.observe(refElement, observerOptions);
    }

    return () => {
      resizeObserver.disconnect();
      (resizeHandler.current as DebouncedFunc<ResizeObserverCallback>).cancel?.();
      setRefElement(null);
    };
  }, [refreshMode, refreshRate, refreshOptions, handleWidth, handleHeight, observerOptions, onResize, refElement]);

  return { ref: onRefChange, ...size };
}

export default useResizeDetector;
