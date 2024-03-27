import { createContext, useContext, useMemo, useState } from 'react';

export type ResfreshModeType = 'throttle' | 'debounce' | undefined;

export type Box = ResizeObserverBoxOptions | undefined;

export interface DemoContext {
  box: Box;
  setBox: React.Dispatch<React.SetStateAction<Box>>;

  refreshMode: ResfreshModeType;
  setRefreshMode: React.Dispatch<React.SetStateAction<ResfreshModeType>>;

  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;

  handleHeight: boolean;
  setHandleHeight: React.Dispatch<React.SetStateAction<boolean>>;

  handleWidth: boolean;
  setHandleWidth: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultContext = {} as DemoContext;

export const DemoContext = createContext<DemoContext>(defaultContext);

export const useDemoContext = () => useContext(DemoContext);

export const DemoProvider = ({ children }: { children: React.ReactNode }) => {
  const [box, setBox] = useState<Box>(undefined);
  const [refreshMode, setRefreshMode] = useState<ResfreshModeType>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [handleHeight, setHandleHeight] = useState(true);
  const [handleWidth, setHandleWidth] = useState(true);

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
    }),
    [refreshMode, isLoading, handleHeight, handleWidth, box],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
};
