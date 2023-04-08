import React, { PureComponent, isValidElement, cloneElement, createRef, ReactNode, ReactElement } from 'react';
import { findDOMNode } from 'react-dom';

import { patchResizeHandler, isFunction, isSSR, isDOMElement, createNotifier } from './utils';
import { ReactResizeDetectorDimensions, ResizeDetectorProps, ChildFunctionProps } from './types';

class ResizeDetector<ElementT extends HTMLElement = HTMLElement> extends PureComponent<
  ResizeDetectorProps<ElementT>,
  ReactResizeDetectorDimensions
> {
  skipOnMount: boolean | undefined;
  targetRef;
  observableElement;
  resizeHandler;
  resizeObserver;
  constructor(props: ResizeDetectorProps<ElementT>) {
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
    this.observableElement = null;
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

  createResizeHandler: ResizeObserverCallback = (entries: ResizeObserverEntry[]): void => {
    const { handleWidth = true, handleHeight = true, onResize } = this.props;

    if (!handleWidth && !handleHeight) return;

    const notifyResize = createNotifier(
      setStateFunc => this.setState(setStateFunc, () => onResize?.(this.state.width, this.state.height)),
      handleWidth,
      handleHeight
    );

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

    switch (renderType) {
      case 'renderProp':
        return render?.(childProps);
      case 'childFunction': {
        const childFunction = children as (props: ChildFunctionProps<ElementT>) => ReactNode;
        return childFunction?.(childProps);
      }
      case 'child': {
        // @TODO bug prone logic
        const child = children as ReactElement;
        if (child.type && typeof child.type === 'string') {
          // child is a native DOM elements such as div, span etc
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { targetRef, ...nativeProps } = childProps;
          return cloneElement(child, nativeProps);
        }
        // class or functional component otherwise
        return cloneElement(child, childProps);
      }
      case 'childArray': {
        const childArray = children as ReactElement[];
        return childArray.map(el => !!el && cloneElement(el, childProps));
      }
      default:
        return <WrapperTag />;
    }
  }
}

export default ResizeDetector;
