import { ReactNode, RefObject } from 'react';

export type ReactResizeDetectorDimensions = {
  height?: number;
  width?: number;
};

export type ChildFunctionProps<ElementT extends HTMLElement> = ReactResizeDetectorDimensions & {
  targetRef?: RefObject<ElementT>;
};

export type ResfreshModeType = 'throttle' | 'debounce';
export type ResfreshOptionsType = { leading?: boolean; trailing?: boolean };
export type OnResizeCallback = (width?: number, height?: number) => void;

export type Props = {
  /**
   * Function that will be invoked with observable element's width and height.
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

export type ResizeDetectorProps<ElementT extends HTMLElement> = Props & {
  /**
   * A selector of an element to observe.
   * You can use this property to attach resize-observer to any DOM element.
   * Please refer to the querySelector docs.
   * Default: undefined
   * @deprecated since version 5.0.0. It will be removed in version 7.0.0.
   * Use targetRef instead
   */
  querySelector?: string;
  /**
   * Valid only for a callback-pattern.
   * Ignored for other render types.
   * Set resize-detector's node type.
   * You can pass any valid React node: string with node's name or element.
   * Can be useful when you need to handle table's or paragraph's resizes.
   * Default: "div"
   * @deprecated since version 5.0.0. It will be removed in version 7.0.0.
   * Use targetRef instead
   */
  nodeType?: keyof JSX.IntrinsicElements; // will be passed to React.createElement()
  /**
   * A DOM element to observe.
   * By default it's a parent element in relation to the ReactResizeDetector component.
   * But you can pass any DOM element to observe.
   * This property is omitted when you pass querySelector.
   * Default: undefined
   * @deprecated since version 5.0.0. It will be removed in version 6.0.0.
   * Use targetRef instead
   */
  targetDomEl?: ElementT;
  /**
   * A React reference of the element to observe.
   * Pass a reference to the element you want to attach resize handlers to.
   * It must be an instance of React.useRef or React.createRef functions
   * Default: undefined
   */
  targetRef?: RefObject<ElementT>;

  render?: (props: ReactResizeDetectorDimensions) => ReactNode;

  children?: ReactNode | ((props: ChildFunctionProps<ElementT>) => ReactNode);
};
