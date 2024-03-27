import type { MutableRefObject } from 'react';

export type ReactResizeDetectorDimensions = {
  height?: number;
  width?: number;
};

/** If element is mounted, returns its dimensions and `ResizeObserverEntry`
 * If element is unmounted, returns null */
export type ResizePayload =
  | { width: number; height: number; entry: ResizeObserverEntry }
  | { width: null; height: null; entry: null };

export type ResfreshModeType = 'throttle' | 'debounce';
export type ResfreshOptionsType = { leading?: boolean; trailing?: boolean };
export type OnResizeCallback = (payload: ResizePayload) => void;

export type Props = {
  /**
   * Function that will be invoked with observable element's width, height and ResizeObserverEntry.
   * If element is unmounted, width and height will be null.
   * Default: undefined
   */
  onResize?: OnResizeCallback;
  /**
   * Trigger update on height change.
   * Default: true
   */
  handleHeight?: boolean;
  /**
   * Trigger onResize on width change.
   * Default: true
   */
  handleWidth?: boolean;
  /**
   * Do not trigger update when a component mounts.
   * Default: false
   */
  skipOnMount?: boolean;
  /**
   * Changes the update strategy. Possible values: "throttle" and "debounce".
   * See `lodash` docs for more information https://lodash.com/docs/
   * undefined - callback will be fired for every frame.
   * Default: undefined
   */
  refreshMode?: ResfreshModeType;
  /**
   * Set the timeout/interval for `refreshMode` strategy
   * Default: undefined
   */
  refreshRate?: number;
  /**
   * Pass additional params to `refreshMode` according to lodash docs
   * Default: undefined
   */
  refreshOptions?: ResfreshOptionsType;
  /**
   * These options will be used as a second parameter of `resizeObserver.observe` method
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/observe
   * Default: undefined
   */
  observerOptions?: ResizeObserverOptions;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OnRefChangeType<T = any> = {
  (node: T | null): void;
  current?: T | null;
};

export interface UseResizeDetectorReturn<T> extends ReactResizeDetectorDimensions {
  ref: OnRefChangeType<T>;
}

export interface useResizeDetectorProps<T extends HTMLElement> extends Props {
  targetRef?: MutableRefObject<T | null>;
}
