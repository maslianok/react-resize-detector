import { useLayoutEffect, useEffect, useState, useRef } from 'react';
import type { MutableRefObject } from 'react';
import type { DebouncedFunc } from 'lodash';

import { patchResizeHandler, createNotifier, isSSR } from './utils';

import type { PatchedResizeObserverCallback } from './utils';
import type { Props, ReactResizeDetectorDimensions } from './types';

const useEnhancedEffect = isSSR() ? useEffect : useLayoutEffect;

export interface useResizeDetectorProps<T extends HTMLElement> extends Props {
  targetRef?: MutableRefObject<T | null>;
}

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
  const localRef = useRef<T | null>(null);
  const resizeHandler = useRef<PatchedResizeObserverCallback>();

  const ref = targetRef ?? localRef;

  const [size, setSize] = useState<ReactResizeDetectorDimensions>({
    width: undefined,
    height: undefined
  });

  useEnhancedEffect(() => {
    if (!handleWidth && !handleHeight) return;

    const notifyResize = createNotifier(setSize, handleWidth, handleHeight);

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

    if (ref.current) {
      resizeObserver.observe(ref.current, observerOptions);
    }

    return () => {
      resizeObserver.disconnect();
      (resizeHandler.current as DebouncedFunc<ResizeObserverCallback>).cancel?.();
    };
  }, [refreshMode, refreshRate, refreshOptions, handleWidth, handleHeight, observerOptions, ref.current]);

  useEffect(() => {
    onResize?.(size.width, size.height);
  }, [size]);

  return { ref, ...size };
}

export default useResizeDetector;

export interface UseResizeDetectorReturn<T> extends ReactResizeDetectorDimensions {
  ref: MutableRefObject<T | null>;
}
