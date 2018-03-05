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
    if (this.props.resizableElementId !== '') {
      this.ro.observe(document.getElementById(this.props.resizableElementId));
    } else {
      this.ro.observe(this.el.parentElement);
    }
  }

  createResizeObserver = (entries) => {
    entries.forEach((entry) => {
      const { width, height } = entry.contentRect;
      const notifyWidth = this.props.handleWidth && this.width !== width;
      const notifyHeight = this.props.handleHeight && this.height !== height;
      if (!this.skipOnMount && (notifyWidth || notifyHeight)) {
        this.props.onResize(width, height);
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
  refreshMode: 'throttle',
  resizableElementId: '',
  onResize: e => e,
};
