import { useLayoutEffect, useState, useRef, MutableRefObject, useCallback } from 'react';

import { patchResizeHandler, createNotifier, isSSR, patchResizeHandlerType } from './utils';

import { Props, ReactResizeDetectorDimensions } from './ResizeDetector';

type resizeHandlerType = MutableRefObject<null | patchResizeHandlerType>;
interface RefCallback {
  (node: null | Element): void;
} 
interface returnType<RefType> extends ReactResizeDetectorDimensions {
  ref: RefCallback;
}

const useResizeDetector =<RefType extends Element = Element>(props: Props = {}): returnType<RefCallback> => {
  const {
    skipOnMount = false,
    refreshMode,
    refreshRate = 1000,
    refreshOptions,
    handleWidth = true,
    handleHeight = true,
    observerOptions,
    onResize
  } = props;

  const skipResize: MutableRefObject<null | boolean> = useRef(skipOnMount);
  const resizeHandler: resizeHandlerType = useRef(null);

  const [refNode, setRefNode] = useState<null|Element>(null)

  const [size, setSize] = useState<ReactResizeDetectorDimensions>({
    width: undefined,
    height: undefined
  });

  useLayoutEffect(() => {
    if (isSSR()) {
      return;
    }

    const notifyResize = createNotifier(onResize, setSize, handleWidth, handleHeight, refNode);

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

    const resizeObserver = new window.ResizeObserver(resizeHandler.current);

    if (refNode) {
      resizeObserver.observe(refNode as Element, observerOptions);
    }

    return () => {
      resizeObserver.disconnect();
      const patchedResizeHandler = resizeHandler.current as any;
      if (patchedResizeHandler && patchedResizeHandler.cancel) {
        patchedResizeHandler.cancel();
      }
    };
  }, [refreshMode, refreshRate, refreshOptions, handleWidth, handleHeight, onResize, observerOptions, refNode]);

  const ref = useCallback(node => {
    setRefNode(node)
  }, [setRefNode]);

  return { ref, ...size };
}

export default useResizeDetector;
