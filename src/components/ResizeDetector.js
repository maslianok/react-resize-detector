import React, { PureComponent, isValidElement, cloneElement } from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import isArray from 'lodash.isarray';
import isFunction from 'lodash.isfunction';

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
  if (!isArray(children)) return [children];
  return children;
}

export default class ResizeDetector extends PureComponent {
  constructor(props) {
    super(props);

    const { skipOnMount, refreshMode, refreshRate } = props;

    this.skipOnMount = skipOnMount;

    this.state = {
      width: undefined,
      height: undefined,
    };

    const resizeObserver =
      (listMode[refreshMode] && listMode[refreshMode](this.createResizeObserver, refreshRate)) ||
      this.createResizeObserver;

    this.ro = new ResizeObserver(resizeObserver);
  }

  componentDidMount() {
    const { resizableElementId } = this.props;
    const resizableElement = resizableElementId ? document.getElementById(resizableElementId) : this.el.parentElement;
    this.ro.observe(resizableElement);
  }

  componentWillUnmount() {
    const { resizableElementId } = this.props;
    const resizableElement = resizableElementId ? document.getElementById(resizableElementId) : this.el.parentElement;
    this.ro.unobserve(resizableElement);
  }

  createResizeObserver = (entries) => {
    const { handleWidth, handleHeight, onResize } = this.props;
    entries.forEach((entry) => {
      const { width, height } = entry.contentRect;
      const notifyWidth = handleWidth && this.state.width !== width;
      const notifyHeight = handleHeight && this.state.height !== height;
      if (!this.skipOnMount && (notifyWidth || notifyHeight)) {
        onResize(width, height);
        this.setState({ width, height });
      }
      this.skipOnMount = false;
    });
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
    return [
      <div
        key="resize-detector"
        style={styles}
        ref={(el) => {
          this.el = el;
        }}
      />,
      ...this.renderChildren(),
    ];
  }
}

ResizeDetector.propTypes = {
  handleWidth: PropTypes.bool,
  handleHeight: PropTypes.bool,
  skipOnMount: PropTypes.bool,
  refreshRate: PropTypes.number,
  refreshMode: PropTypes.string,
  resizableElementId: PropTypes.string,
  onResize: PropTypes.func,
  children: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};

ResizeDetector.defaultProps = {
  handleWidth: false,
  handleHeight: false,
  skipOnMount: false,
  refreshRate: 1000,
  refreshMode: undefined,
  resizableElementId: '',
  onResize: e => e,
  children: null,
};
