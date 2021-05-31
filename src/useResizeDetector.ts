import { useLayoutEffect, useEffect, useState, useRef, MutableRefObject } from 'react';

import {
  patchResizeHandler,
  createNotifier,
  isSSR,
  patchResizeHandlerType
} from './utils';

import { Props, ReactResizeDetectorDimensions } from './ResizeDetector';

interface FunctionProps extends Props {
  targetRef?: ReturnType<typeof useRef>;

  /**
   * Whether to allow measuring during the render cycle. While measuring
   * during the render cycle allows for the size to be used in the first
   * render, it could cause a "Cannot update a component while rendering a
   * different component" error if passed via a callback to a component that
   * then calls `setState` with it.
   * Default: true
   */
  measureDuringRender?: boolean;
}

function useResizeDetector<T extends Element = any>(props: FunctionProps = {}) {
  const {
    skipOnMount = false,
    refreshMode,
    refreshRate = 1000,
    refreshOptions,
    handleWidth = true,
    handleHeight = true,
    measureDuringRender = true,
    targetRef,
    observerOptions,
    onResize
  } = props;

  const skipResize: MutableRefObject<null | boolean> = useRef(skipOnMount);
  const localRef = useRef(null);
  const ref = (targetRef ?? localRef) as MutableRefObject<T | null>;
  const resizeHandler = useRef<patchResizeHandlerType>();

  const [size, setSize] = useState<ReactResizeDetectorDimensions>({
    width: undefined,
    height: undefined
  });

  const useEnhancedEffect =
    isSSR() || !measureDuringRender ? useEffect : useLayoutEffect;

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
      resizeObserver.observe(ref.current, observerOptions);
    }

    return () => {
      resizeObserver.disconnect();
      const patchedResizeHandler = resizeHandler.current;
      if (patchedResizeHandler && 'cancel' in patchedResizeHandler) {
        patchedResizeHandler.cancel();
      }
    };
  }, [refreshMode, refreshRate, refreshOptions, handleWidth, handleHeight, onResize, observerOptions, ref.current]);

  return { ref, ...size };
}

export default useResizeDetector;
