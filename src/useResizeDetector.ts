import { useLayoutEffect, useEffect, useState, useRef, MutableRefObject } from 'react';

import { patchResizeHandler, createNotifier, isSSR } from './utils';

import { Props, ReactResizeDetectorDimensions } from './ResizeDetector';

const useEnhancedEffect = isSSR() ? useEffect : useLayoutEffect;

interface FunctionProps extends Props {
  targetRef?: ReturnType<typeof useRef>;
}

function useResizeDetector<T = any>(props: FunctionProps = {}): UseResizeDetectorReturn<T> {
  const {
    skipOnMount = false,
    refreshMode,
    refreshRate = 1000,
    refreshOptions,
    handleWidth = true,
    handleHeight = true,
    targetRef,
    observerOptions,
    onResize
  } = props;

  const skipResize: MutableRefObject<null | boolean> = useRef(skipOnMount);
  const localRef = useRef(null);
  const ref = (targetRef ?? localRef) as MutableRefObject<T | null>;
  const resizeHandler = useRef<ResizeObserverCallback>();

  const [size, setSize] = useState<ReactResizeDetectorDimensions>({
    width: undefined,
    height: undefined
  });

  useEnhancedEffect(() => {
    if (isSSR()) {
      return;
    }

    const notifyResize = createNotifier(onResize, setSize, handleWidth, handleHeight);

    const resizeCallback: ResizeObserverCallback = entries => {
      if (!handleWidth && !handleHeight) return;

      entries.forEach(entry => {
        const { width, height } = (entry && entry.contentRect) || {};

        const shouldSetSize = !skipResize.current && !isSSR();
        if (shouldSetSize) {
          notifyResize({ width, height });
        }

        skipResize.current = false;
      });
    };

    resizeHandler.current = patchResizeHandler(resizeCallback, refreshMode, refreshRate, refreshOptions);

    const resizeObserver = new window.ResizeObserver(resizeHandler.current as ResizeObserverCallback);

    if (ref.current) {
      // Something wrong with typings here...
      resizeObserver.observe(ref.current as any, observerOptions);
    }

    return () => {
      resizeObserver.disconnect();
      const patchedResizeHandler = resizeHandler.current as any;
      if (patchedResizeHandler && patchedResizeHandler.cancel) {
        patchedResizeHandler.cancel();
      }
    };
  }, [refreshMode, refreshRate, refreshOptions, handleWidth, handleHeight, onResize, observerOptions, ref.current]);

  return { ref, ...size };
}

export default useResizeDetector;

export interface UseResizeDetectorReturn<T> extends ReactResizeDetectorDimensions {
  ref: MutableRefObject<T | null>;
}
