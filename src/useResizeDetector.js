import { useEffect, useState, useRef } from 'react';
import rafSchd from 'raf-schd';

import { getRefreshScheduler, isFunction, isSSR } from './lib/utils';

const createAsyncNotifier = (onResize, setSize) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  rafSchd(({ width, height }) => {
    if (isFunction(onResize)) {
      onResize(width, height);
    }

    setSize({ width, height });
  });

function useResizeDetector(props = {}) {
  const {
    skipOnMount = false,
    refreshMode,
    refreshRate,
    refreshOptions,
    handleWidth = true,
    handleHeight = true,
    onResize
  } = props;

  const skipResize = useRef(null);
  const ref = useRef(null);
  const resizeHandler = useRef(null);
  const onResizeCallback = useRef(onResize);

  useEffect(() => {
    if (skipResize.current === null) {
      skipResize.current = skipOnMount;
    }
  }, [skipOnMount]);

  const [size, setSize] = useState({
    width: undefined,
    height: undefined
  });

  useEffect(() => {
    const notifyResizeAsync = createAsyncNotifier(onResizeCallback.current, setSize);

    const createResizeHandler = entries => {
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

    const refreshScheduler = getRefreshScheduler(refreshMode);

    resizeHandler.current = refreshScheduler
      ? refreshScheduler(createResizeHandler, refreshRate, refreshOptions)
      : createResizeHandler;

    const resizeObserver = new ResizeObserver(resizeHandler.current);
    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
      notifyResizeAsync.cancel();
      if (resizeHandler.current && resizeHandler.current.cancel) {
        resizeHandler.current.cancel();
      }
    };
  }, [refreshMode, refreshRate, refreshOptions, handleWidth, handleHeight, onResizeCallback]);

  return { ref, ...size };
}

export default useResizeDetector;
