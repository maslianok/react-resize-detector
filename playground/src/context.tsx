import { createContext, useContext, useMemo, useState } from 'react';

export type RefreshModeType = 'throttle' | 'debounce' | undefined;

export type Box = ResizeObserverBoxOptions | undefined;

export interface DemoContext {
  box: Box;
  setBox: React.Dispatch<React.SetStateAction<Box>>;

  refreshMode: RefreshModeType;
  setRefreshMode: React.Dispatch<React.SetStateAction<RefreshModeType>>;

  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;

  handleHeight: boolean;
  setHandleHeight: React.Dispatch<React.SetStateAction<boolean>>;

  handleWidth: boolean;
  setHandleWidth: React.Dispatch<React.SetStateAction<boolean>>;

  disableRerender: boolean;
  setDisableRerender: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultContext = {} as DemoContext;

export const DemoContext = createContext<DemoContext>(defaultContext);

export const useDemoContext = () => useContext(DemoContext);

export const DemoProvider = ({ children }: { children: React.ReactNode }) => {
  const [box, setBox] = useState<Box>(undefined);
  const [refreshMode, setRefreshMode] = useState<RefreshModeType>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [handleHeight, setHandleHeight] = useState(true);
  const [handleWidth, setHandleWidth] = useState(true);
  const [disableRerender, setDisableRerender] = useState(false);

  const value = useMemo(
    () => ({
      refreshMode,
      setRefreshMode,
      isLoading,
      setIsLoading,
      handleHeight,
      setHandleHeight,
      handleWidth,
      setHandleWidth,
      box,
      setBox,
      disableRerender,
      setDisableRerender,
    }),
    [refreshMode, isLoading, handleHeight, handleWidth, box, disableRerender],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
};
