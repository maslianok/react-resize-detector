import React, {
  PureComponent, isValidElement, cloneElement,
} from 'react';
import { findDOMNode } from 'react-dom';
import {
  bool, number, string, shape, func, any,
} from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
import rafSchd from 'raf-schd';
import { getHandle, isFunction, checkIsHaveWindow } from 'lib/utils';
import Reference from 'components/Reference';

class ResizeDetector extends PureComponent {
  constructor(props) {
    super(props);

    const {
      skipOnMount,
      refreshMode,
      refreshRate,
      refreshOptions,
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
    this.toggleObserver(true);
  }

  componentWillUnmount() {
    this.toggleObserver(false);

    this.rafClean();

    this.cancelHandler();

    this.unmounted = true;
  }

  cancelHandler = () => {
    const shouldCancel = !!(this.resizeHandler && this.resizeHandler.cancel);
    if (shouldCancel) {
      // cancel debounced handler
      this.resizeHandler.cancel();
      this.resizeHandler = null;
    }
  }

  rafClean = () => {
    const shouldClean = !!(this.raf && this.raf.cancel);
    if (shouldClean) {
      this.raf.cancel();
      this.raf = null;
    }
  }

  toggleObserver = (isOn) => {
    const element = this.getElement();
    if (!element) return;

    const type = isOn ? 'observe' : 'unobserve';
    const handle = this.resizeObserver[type];
    if (!handle) return;

    handle(element);
  }

  getElement = () => {
    const { querySelector } = this.props;

    const isHaveWindow = checkIsHaveWindow();
    if (!isHaveWindow) return null;

    const selectedElement = querySelector && document.querySelector(querySelector);

    // eslint-disable-next-line react/no-find-dom-node
    const currentElement = findDOMNode(this.element);
    const parentElement = currentElement && currentElement.parentElement;

    const element = selectedElement || parentElement;
    return element;
  };

  createUpdater = () => {
    this.rafClean();

    this.raf = rafSchd(({ width, height }) => {
      const { onResize } = this.props;

      if (isFunction(onResize)) {
        onResize(width, height);
      }

      if (!this.unmounted) {
        this.setState({ width, height });
      }
    });

    return this.raf;
  }

  createResizeHandler = (entries) => {
    const {
      width: widthCurrent,
      height: heightCurrent,
    } = this.state;
    const {
      handleWidth,
      handleHeight,
    } = this.props;

    const updater = this.createUpdater();

    entries.forEach((entry) => {
      const { width, height } = (entry && entry.contentRect) || {};

      const isWidthChanged = handleWidth && widthCurrent !== width;
      const isHeightChanged = handleHeight && heightCurrent !== height;
      const isSizeChanged = isWidthChanged || isHeightChanged;

      const isHaveWindow = checkIsHaveWindow();

      const shouldSetSize = !this.skipOnMount && isSizeChanged && isHaveWindow;
      if (shouldSetSize) {
        updater({ width, height });
      }

      this.skipOnMount = false;
    });
  };

  onRef = (el) => {
    this.element = el;
  };

  getComponent = () => {
    const { width, height } = this.state;
    const { render, children } = this.props;

    const childProps = { width, height };
    const isRenderProps = isFunction(render);
    const isFunctional = isFunction(children);
    const isComponent = isValidElement(children);

    let component;
    if (!component && isRenderProps) {
      component = cloneElement(render(childProps), { key: 'resize-detector' });
    }

    if (!component && isFunctional) {
      component = cloneElement(children(childProps));
    }

    if (!component && isComponent) {
      component = cloneElement(children, childProps);
    }

    return component;
  };

  render() {
    const component = this.getComponent();
    return <Reference ref={this.onRef}>{component || <div />}</Reference>;
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
  onResize: func,
  render: func,
  children: any, // eslint-disable-line react/forbid-prop-types
};

ResizeDetector.defaultProps = {
  handleWidth: false,
  handleHeight: false,
  skipOnMount: false,
  refreshRate: 1000,
  refreshMode: undefined,
  refreshOptions: undefined,
  querySelector: null,
  onResize: null,
  render: undefined,
  children: null,
};

export default ResizeDetector;
