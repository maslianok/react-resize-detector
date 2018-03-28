import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';

const listMode = { debounce, throttle };

const styles = {
  position: 'absolute',
  width: 0,
  height: 0,
  visibility: 'hidden',
  display: 'none',
};

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
      const { width, height } = entry.contentRect;
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

  render() {
    return (
      <div
        style={styles}
        ref={(el) => {
          this.el = el;
        }}
      />
    );
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
};

ResizeDetector.defaultProps = {
  handleWidth: false,
  handleHeight: false,
  skipOnMount: false,
  refreshRate: 1000,
  refreshMode: undefined,
  resizableElementId: '',
  onResize: e => e,
};
