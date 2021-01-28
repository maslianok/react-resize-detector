import { useEffect, useState, useRef, MutableRefObject } from 'react';
import rafSchd from 'raf-schd';

import { patchResizeHandler, isFunction, isSSR, patchResizeHandlerType } from './utils';

import { Props, ReactResizeDetectorDimensions } from './ResizeDetector';

type resizeHandlerType = MutableRefObject<null | patchResizeHandlerType>;
interface returnType<RefType> extends ReactResizeDetectorDimensions {
  ref: MutableRefObject<null | RefType>
}

const createAsyncNotifier = (
  onResize: Props['onResize'],
  setSize: React.Dispatch<React.SetStateAction<ReactResizeDetectorDimensions>>
) =>
  rafSchd(({ width, height }) => {
    if (onResize && isFunction(onResize)) {
      onResize(width, height);
    }

    setSize(prev => {
      if (prev.width === width && prev.height === height) {
        return prev;
      }
      return { width, height };
    });
  });

function useResizeDetector<RefType extends Element = Element>(props: Props = {}): returnType<RefType> {
  const {
    skipOnMount = false,
    refreshMode,
    refreshRate = 1000,
    refreshOptions,
    handleWidth = true,
    handleHeight = true,
    onResize
  } = props;

  const skipResize: MutableRefObject<null | boolean> = useRef(null);
  const ref: MutableRefObject<null | RefType> = useRef<RefType>(null);
  const resizeHandler: resizeHandlerType = useRef(null);
  const onResizeCallback = useRef(onResize);

  useEffect(() => {
    if (skipResize.current === null) {
      skipResize.current = skipOnMount;
    }
  }, [skipOnMount]);

  const [size, setSize] = useState<ReactResizeDetectorDimensions>({
    width: undefined,
    height: undefined
  });

  useEffect(() => {
    if (isSSR()) {
      return;
    }

    const notifyResizeAsync = createAsyncNotifier(onResizeCallback.current, setSize);

    const resizeCallback: ResizeObserverCallback = entries => {
      if (!handleWidth && !handleHeight) return;

      entries.forEach(entry => {
        const { width, height } = (entry && entry.contentRect) || {};

        const shouldSetSize = !skipResize.current && !isSSR();
        if (shouldSetSize) {
          notifyResizeAsync({ width, height });
        }

        skipResize.current = false;
      });
    };

    resizeHandler.current = patchResizeHandler(resizeCallback, refreshMode, refreshRate, refreshOptions);

    const resizeObserver = new window.ResizeObserver(resizeHandler.current);
    if (ref.current) {
      resizeObserver.observe(ref.current as Element);
    }

    return () => {
      resizeObserver.disconnect();
      notifyResizeAsync.cancel();
      const patchedResizeHandler = resizeHandler.current as any;
      if (patchedResizeHandler && patchedResizeHandler.cancel) {
        patchedResizeHandler.cancel();
      }
    };
  }, [refreshMode, refreshRate, refreshOptions, handleWidth, handleHeight, onResizeCallback]);

  return { ref, ...size };
}

export default useResizeDetector;
