import React, { Component, PropTypes } from 'react';

import { parentStyle, shrinkChildStyle, expandChildStyle } from '../helpers/resizeDetectorStyles';

export default class ResizeDetector extends Component {
  constructor() {
    super();

    this.state = {
      expandChildHeight: 0,
      expandChildWidth: 0,
      expandScrollLeft: 0,
      expandScrollTop: 0,
      shrinkScrollTop: 0,
      shrinkScrollLeft: 0,
      lastWidth: 0,
      lastHeight: 0,
    };

    this.reset = this.reset.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    this.reset();
  }

  shouldComponentUpdate(nextProps) {
    return this.props !== nextProps;
  }

  componentDidUpdate() {
    this.expand.scrollLeft = this.expand.scrollWidth;
    this.expand.scrollTop = this.expand.scrollHeight;

    this.shrink.scrollLeft = this.shrink.scrollWidth;
    this.shrink.scrollTop = this.shrink.scrollHeight;
  }

  reset() {
    const parent = this.container.parentElement;

    let position = 'static';
    if (parent.currentStyle) {
      position = parent.currentStyle.position;
    } else if (window.getComputedStyle) {
      position = window.getComputedStyle(parent).position;
    }
    if (position === 'static') {
      parent.style.position = 'relative';
    }

    this.setState({
      expandChildHeight: this.expand.offsetHeight + 10,
      expandChildWidth: this.expand.offsetWidth + 10,
      lastWidth: this.props.handleWidth && this.container.parentElement.offsetWidth,
      lastHeight: this.props.handleHeight && this.container.parentElement.offsetHeight,
    });
  }

  handleScroll() {
    const { state, props } = this;

    if (
      (props.handleWidth && this.container.parentElement.offsetWidth !== state.lastWidth) ||
      (props.handleHeight && this.container.parentElement.offsetHeight !== state.lastHeight)
    ) {
      this.props.onResize();
    }

    this.reset();
  }

  render() {
    const { state } = this;


    const expandStyle = Object.assign({}, expandChildStyle, {
      width: state.expandChildWidth,
      height: state.expandChildHeight,
    });

    return (
      <div style={parentStyle} ref={e => {this.container = e;}}>
        <div style={parentStyle} onScroll={this.handleScroll} ref={e => {this.expand = e;}}>
          <div style={expandStyle} />
        </div>
        <div style={parentStyle} onScroll={this.handleScroll} ref={e => {this.shrink = e;}}>
          <div style={shrinkChildStyle} />
        </div>
      </div>
    );
  }
}

ResizeDetector.propTypes = {
  handleWidth: PropTypes.bool,
  handleHeight: PropTypes.bool,
  onResize: PropTypes.func,
};

ResizeDetector.defaultProps = {
  handleWidth: false,
  handleHeight: false,
  onResize: e => e,
};
