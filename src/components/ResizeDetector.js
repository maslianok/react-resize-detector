import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';

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

    this.width = undefined;
    this.height = undefined;
    this.skipOnMount = props.skipOnMount;

    this.ro = new ResizeObserver((entries) => {
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
    });
  }

  componentDidMount() {
	  if (this.props.resizableObjectId !== '') {
        this.ro.observe(document.getElementById(this.props.resizableObjectId));
      }
      else {
        this.ro.observe(this.el.parentElement);
      }
  }

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
  resizableObjectId: PropTypes.string,
  onResize: PropTypes.func,
};

ResizeDetector.defaultProps = {
  handleWidth: false,
  handleHeight: false,
  skipOnMount: false,
  resizableObjectId: '',
  onResize: e => e,
};
