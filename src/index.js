import React, {
  PureComponent, Component, isValidElement, cloneElement, createElement,
} from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
import { debounce, throttle, isFunction } from 'lodash';

const listMode = { debounce, throttle };

const styles = {
  position: 'absolute',
  width: 0,
  height: 0,
  visibility: 'hidden',
  display: 'none',
};

/**
 * detect component's children and convert them to array
 * @param {*} children - component's children
 */
function convertChildrenToArray(children) {
  if (!children) return [];
  if (!Array.isArray(children)) return [children];
  return children;
}

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
    this.animationFrameID = null;

    this.resizeHandler = listMode[refreshMode]
      ? listMode[refreshMode](this.createResizeHandler, refreshRate, refreshOptions)
      : this.createResizeHandler;

    this.ro = new ResizeObserver(this.resizeHandler);
  }

  componentDidMount() {
    const resizableElement = this.getElement();
    if (resizableElement) this.ro.observe(resizableElement);
  }

  componentWillUnmount() {
    const resizableElement = this.getElement();
    if (resizableElement) this.ro.unobserve(resizableElement);
    if (typeof window !== 'undefined' && this.animationFrameID) {
      window.cancelAnimationFrame(this.animationFrameID);
    }
    if (this.resizeHandler && this.resizeHandler.cancel) {
      // cancel debounced handler
      this.resizeHandler.cancel();
    }
  }

  getElement = () => {
    const { resizableElementId } = this.props;

    const otherElement = resizableElementId && document.getElementById(resizableElementId);
    const parentElement = this.el && this.el.parentElement;

    const resizableElement = otherElement || parentElement;

    return resizableElement;
  };

  createResizeHandler = (entries) => {
    const { handleWidth, handleHeight, onResize } = this.props;
    entries.forEach((entry) => {
      const { width, height } = entry.contentRect;
      const notifyWidth = handleWidth && this.state.width !== width;
      const notifyHeight = handleHeight && this.state.height !== height;
      if (!this.skipOnMount && (notifyWidth || notifyHeight) && typeof window !== 'undefined') {
        this.animationFrameID = window.requestAnimationFrame(() => {
          onResize(width, height);
          this.setState({ width, height });
        });
      }
      this.skipOnMount = false;
    });
  };

  handleRenderProp = () => {
    const { width, height } = this.state;
    const { render } = this.props;
    if (render && typeof render === 'function') {
      return cloneElement(render({ width, height }), { key: 'render' });
    }

    return undefined;
  };

  renderChildren = () => {
    const { width, height } = this.state;
    const { children } = this.props;
    return convertChildrenToArray(children)
      .filter(child => !!child)
      .map((child, key) => {
        if (isFunction(child)) return cloneElement(child(width, height), { key });
        if (isValidElement(child)) return cloneElement(child, { width, height, key });
        return child;
      });
  };

  render() {
    const { nodeType } = this.props;
    const resizeDetector = createElement(nodeType, {
      key: 'resize-detector',
      style: styles,
      ref: (el) => {
        this.el = el;
      },
    });
    return [resizeDetector, this.handleRenderProp(), ...this.renderChildren()];
  }
}

ResizeDetector.propTypes = {
  handleWidth: PropTypes.bool,
  handleHeight: PropTypes.bool,
  skipOnMount: PropTypes.bool,
  refreshRate: PropTypes.number,
  refreshMode: PropTypes.string,
  refreshOptions: PropTypes.shape({
    leading: PropTypes.bool,
    trailing: PropTypes.bool,
  }),
  resizableElementId: PropTypes.string,
  onResize: PropTypes.func,
  render: PropTypes.func,
  children: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  nodeType: PropTypes.node, // eslint-disable-line react/forbid-prop-types
};

ResizeDetector.defaultProps = {
  handleWidth: false,
  handleHeight: false,
  skipOnMount: false,
  refreshRate: 1000,
  refreshMode: undefined,
  refreshOptions: undefined,
  resizableElementId: '',
  onResize: e => e,
  render: undefined,
  children: null,
  nodeType: 'div',
};

export const withResizeDetector = (WrappedComponent, props = { handleWidth: true, handleHeight: true }) =>
  // eslint-disable-next-line
  class ResizeDetectorHOC extends Component {
    render() {
      return (
        <ResizeDetector {...props}>
          <WrappedComponent {...this.props} />
        </ResizeDetector>
      );
    }
  };

export default ResizeDetector;
