import React, {
  PureComponent, isValidElement, cloneElement, createElement,
} from 'react';
import { findDOMNode } from 'react-dom';
import ResizeObserver from 'resize-observer-polyfill';
import rafSchd from 'raf-schd';
import {
  bool, number, string, shape, func, any, node,
} from 'prop-types';

import {
  getHandle, isFunction, isSSR, isDOMElement,
} from 'lib/utils';
import ChildWrapper from 'components/ChildWrapper';

class ResizeDetector extends PureComponent {
  constructor(props) {
    super(props);

    const {
      skipOnMount, refreshMode, refreshRate, refreshOptions,
    } = props;

    this.state = {
      width: undefined,
      height: undefined,
    };

    this.skipOnMount = skipOnMount;
    this.raf = null;
    this.element = null;
    this.unmounted = false;

    const handle = getHandle(refreshMode);
    this.resizeHandler = handle
      ? handle(this.createResizeHandler, refreshRate, refreshOptions)
      : this.createResizeHandler;

    this.resizeObserver = new ResizeObserver(this.resizeHandler);
  }

  componentDidMount() {
    this.toggleObserver('observe');
  }

  componentWillUnmount() {
    this.toggleObserver('unobserve');

    this.rafClean();

    this.cancelHandler();

    this.unmounted = true;
  }

  cancelHandler = () => {
    if (this.resizeHandler && this.resizeHandler.cancel) {
      // cancel debounced handler
      this.resizeHandler.cancel();
      this.resizeHandler = null;
    }
  };

  rafClean = () => {
    if (this.raf && this.raf.cancel) {
      this.raf.cancel();
      this.raf = null;
    }
  };

  toggleObserver = (type) => {
    const element = this.getElement();
    if (!element || !this.resizeObserver[type]) return;

    this.resizeObserver[type](element);
  };

  getElement = () => {
    const { querySelector, targetDomEl } = this.props;

    if (isSSR()) return undefined;

    if (querySelector) return document.querySelector(querySelector);

    if (targetDomEl && isDOMElement(targetDomEl)) return targetDomEl;

    // eslint-disable-next-line react/no-find-dom-node
    const currentElement = this.element && findDOMNode(this.element);

    if (!currentElement) return undefined;

    return currentElement.parentElement;
  };

  createUpdater = () => {
    this.rafClean();

    this.raf = rafSchd(({ width, height }) => {
      const { onResize } = this.props;

      if (isFunction(onResize)) {
        onResize(width, height);
      }

      this.setState({ width, height });
    });

    return this.raf;
  };

  createResizeHandler = (entries) => {
    const { width: widthCurrent, height: heightCurrent } = this.state;
    const { handleWidth, handleHeight } = this.props;

    if (!handleWidth && !handleHeight) return;

    const updater = this.createUpdater();

    entries.forEach((entry) => {
      const { width, height } = (entry && entry.contentRect) || {};

      const isWidthChanged = handleWidth && widthCurrent !== width;
      const isHeightChanged = handleHeight && heightCurrent !== height;
      const isSizeChanged = isWidthChanged || isHeightChanged;

      const shouldSetSize = !this.skipOnMount && isSizeChanged && !isSSR();
      if (shouldSetSize) {
        updater({ width, height });
      }

      this.skipOnMount = false;
    });
  };

  onRef = (el) => {
    this.element = el;
  };

  getRenderType = () => {
    const { render, children } = this.props;
    if (isFunction(render)) {
      return 'renderProp';
    }

    if (isFunction(children)) {
      return 'childFunction';
    }

    if (isValidElement(children)) {
      return 'child';
    }

    if (Array.isArray(children)) {
      return 'childArray';
    }

    return 'parent';
  };

  getTargetComponent = () => {
    const { render, children, nodeType } = this.props;
    const { width, height } = this.state;

    const childProps = { width, height };
    const renderType = this.getRenderType();

    switch (renderType) {
      case 'renderProp':
        return cloneElement(render(childProps), { key: 'resize-detector' });
      case 'childFunction':
        return cloneElement(children(childProps));
      case 'child':
        return cloneElement(children, childProps);
      case 'childArray':
        return children.map(el => !!el && cloneElement(el, childProps));
      default:
        return createElement(nodeType);
    }
  };

  render() {
    return <ChildWrapper ref={this.onRef}>{this.getTargetComponent()}</ChildWrapper>;
  }
}

ResizeDetector.propTypes = {
  handleWidth: bool,
  handleHeight: bool,
  skipOnMount: bool,
  refreshRate: number,
  refreshMode: string,
  refreshOptions: shape({
    leading: bool,
    trailing: bool,
  }),
  querySelector: string,
  targetDomEl: any, // eslint-disable-line react/forbid-prop-types
  onResize: func,
  render: func,
  children: any, // eslint-disable-line react/forbid-prop-types
  nodeType: node,
};

ResizeDetector.defaultProps = {
  handleWidth: false,
  handleHeight: false,
  skipOnMount: false,
  refreshRate: 1000,
  refreshMode: undefined,
  refreshOptions: undefined,
  querySelector: null,
  targetDomEl: null,
  onResize: null,
  render: undefined,
  children: null,
  nodeType: 'div',
};

export default ResizeDetector;
