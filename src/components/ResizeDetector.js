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
 * detect childen of component and convert to array
 * @param {*} children - children of component
 */
function convertChildToArray(children) {
  if (!children) return null;
  if (!isArray(children)) return [children];
  return children;
}

export default class ResizeDetector extends PureComponent {
  constructor(props) {
    super(props);

    const { skipOnMount, refreshMode, refreshRate } = props;

    this.width = undefined;
    this.height = undefined;
    this.skipOnMount = skipOnMount;

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
    const {
      handleWidth, handleHeight, onResize,
    } = this.props;
    entries.forEach((entry) => {
      let { width, height } = entry.contentRect;
      width = Math.floor(width);
      height = Math.floor(height);
      const notifyWidth = handleWidth && this.width !== width;
      const notifyHeight = handleHeight && this.height !== height;
      if (!this.skipOnMount && (notifyWidth || notifyHeight)) {
        onResize(width, height);
      }
      this.width = width;
      this.height = height;
      this.skipOnMount = false;
    });
  };

  renderChildren = () => {
    const { width = null, height = null } = this;
    const { children } = this.props;
    const child = convertChildToArray(children) || [];
    return child.map((c) => {
      if (isFunction(c)) return c(width, height);
      if (isValidElement(c)) return cloneElement(c, { width, height });
      return c;
    });
  }

  render() {
    const children = this.renderChildren();
    return [
      <div
        style={styles}
        ref={(el) => {
          this.el = el;
        }}
      />,
      ...children,
    ].filter(c => !!c).map((c, key) => cloneElement((c), { key }));
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
