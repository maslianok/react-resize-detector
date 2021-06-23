import * as React from 'react';
import { PureComponent, isValidElement, cloneElement, createRef, ReactNode, ReactElement, RefObject } from 'react';
import { findDOMNode } from 'react-dom';

import { patchResizeHandler, isFunction, isSSR, isDOMElement, createNotifier } from './utils';

export interface ReactResizeDetectorDimensions {
  height?: number;
  width?: number;
}

interface ChildFunctionProps<ElementT extends HTMLElement> extends ReactResizeDetectorDimensions {
  targetRef?: RefObject<ElementT>;
}

export interface Props {
  /**
   * Function that will be invoked with observable element's width and height.
   * Default: undefined
   */
  onResize?: (width?: number, height?: number) => void;
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
  refreshMode?: 'throttle' | 'debounce';
  /**
   * Set the timeout/interval for `refreshMode` strategy
   * Default: undefined
   */
  refreshRate?: number;
  /**
   * Pass additional params to `refreshMode` according to lodash docs
   * Default: undefined
   */
  refreshOptions?: { leading?: boolean; trailing?: boolean };
  /**
   * These options will be used as a second parameter of `resizeObserver.observe` method
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/observe
   * Default: undefined
   */
  observerOptions?: ResizeObserverOptions;
}

export interface ComponentsProps<ElementT extends HTMLElement> extends Props {
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
}

class ResizeDetector<ElementT extends HTMLElement = HTMLElement> extends PureComponent<
  ComponentsProps<ElementT>,
  ReactResizeDetectorDimensions
> {
  skipOnMount: boolean | undefined;
  targetRef;
  observableElement;
  resizeHandler;
  resizeObserver;
  constructor(props: ComponentsProps<ElementT>) {
    super(props);

    const { skipOnMount, refreshMode, refreshRate = 1000, refreshOptions } = props;

    this.state = {
      width: undefined,
      height: undefined
    };

    this.skipOnMount = skipOnMount;
    this.targetRef = createRef();
    this.observableElement = null;

    if (isSSR()) {
      return;
    }

    this.resizeHandler = patchResizeHandler(this.createResizeHandler, refreshMode, refreshRate, refreshOptions);
    this.resizeObserver = new window.ResizeObserver(this.resizeHandler);
  }

  componentDidMount(): void {
    this.attachObserver();
  }

  componentDidUpdate(): void {
    this.attachObserver();
  }

  componentWillUnmount(): void {
    if (isSSR()) {
      return;
    }
    this.resizeObserver.disconnect();
    this.cancelHandler();
  }

  cancelHandler = (): void => {
    if (this.resizeHandler && this.resizeHandler.cancel) {
      // cancel debounced handler
      this.resizeHandler.cancel();
      this.resizeHandler = null;
    }
  };

  attachObserver = (): void => {
    const { targetRef, observerOptions } = this.props;

    if (isSSR()) {
      return;
    }

    if (targetRef && targetRef.current) {
      this.targetRef.current = targetRef.current;
    }

    const element = this.getElement();
    if (!element) {
      // can't find element to observe
      return;
    }

    if (this.observableElement && this.observableElement === element) {
      // element is already observed
      return;
    }

    this.observableElement = element;
    this.resizeObserver.observe(element, observerOptions);
  };

  getElement = (): Element | Text | null => {
    const { querySelector, targetDomEl } = this.props;

    if (isSSR()) return null;

    // in case we pass a querySelector
    if (querySelector) return document.querySelector(querySelector);
    // in case we pass a DOM element
    if (targetDomEl && isDOMElement(targetDomEl)) return targetDomEl;
    // in case we pass a React ref using React.createRef()
    if (this.targetRef && isDOMElement(this.targetRef.current)) return this.targetRef.current;

    // the worse case when we don't receive any information from the parent and the library doesn't add any wrappers
    // we have to use a deprecated `findDOMNode` method in order to find a DOM element to attach to
    const currentElement = findDOMNode(this);

    if (!currentElement) return null;

    const renderType = this.getRenderType();
    switch (renderType) {
      case 'renderProp':
        return currentElement;
      case 'childFunction':
        return currentElement;
      case 'child':
        return currentElement;
      case 'childArray':
        return currentElement;
      default:
        return currentElement.parentElement;
    }
  };

  createResizeHandler: ResizeObserverCallback = (entries): void => {
    const { handleWidth = true, handleHeight = true, onResize } = this.props;

    if (!handleWidth && !handleHeight) return;

    const notifyResize = createNotifier(onResize, this.setState.bind(this), handleWidth, handleHeight);

    entries.forEach(entry => {
      const { width, height } = (entry && entry.contentRect) || {};

      const shouldSetSize = !this.skipOnMount && !isSSR();
      if (shouldSetSize) {
        notifyResize({ width, height });
      }

      this.skipOnMount = false;
    });
  };

  getRenderType = (): string => {
    const { render, children } = this.props;
    if (isFunction(render)) {
      // DEPRECATED. Use `Child Function Pattern` instead
      return 'renderProp';
    }

    if (isFunction(children)) {
      return 'childFunction';
    }

    if (isValidElement(children)) {
      return 'child';
    }

    if (Array.isArray(children)) {
      // DEPRECATED. Wrap children with a single parent
      return 'childArray';
    }

    // DEPRECATED. Use `Child Function Pattern` instead
    return 'parent';
  };

  render() {
    const { render, children, nodeType: WrapperTag = 'div' } = this.props;
    const { width, height } = this.state;

    const childProps = { width, height, targetRef: this.targetRef };
    const renderType = this.getRenderType();

    let typedChildren: any;

    switch (renderType) {
      case 'renderProp':
        return render && render(childProps);
      case 'childFunction':
        typedChildren = children as (props: ChildFunctionProps<ElementT>) => ReactNode;
        return typedChildren(childProps);
      case 'child':
        // @TODO bug prone logic
        typedChildren = children as ReactElement;
        if (typedChildren.type && typeof typedChildren.type === 'string') {
          // child is a native DOM elements such as div, span etc
          const { targetRef, ...nativeProps } = childProps;
          return cloneElement(typedChildren, nativeProps);
        }
        // class or functional component otherwise
        return cloneElement(typedChildren, childProps);
      case 'childArray':
        typedChildren = children as [ReactElement];
        return typedChildren.map((el: ReactElement) => !!el && cloneElement(el, childProps));
      default:
        return <WrapperTag />;
    }
  }
}

export default ResizeDetector;
