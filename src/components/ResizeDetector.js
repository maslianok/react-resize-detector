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
    const { refs: { expand, shrink } } = this;

    expand.scrollLeft = expand.scrollWidth;
    expand.scrollTop = expand.scrollHeight;

    shrink.scrollLeft = shrink.scrollWidth;
    shrink.scrollTop = shrink.scrollHeight;
  }

  reset() {
    const { refs: { expand, container }, props } = this;
    const parent = container.parentElement;

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
      expandChildHeight: expand.offsetHeight + 10,
      expandChildWidth: expand.offsetWidth + 10,
      lastWidth: props.handleWidth && container.parentElement.offsetWidth,
      lastHeight: props.handleHeight && container.parentElement.offsetHeight,
    });
  }

  handleScroll() {
    const { refs: { container }, state, props } = this;

    if (
      (props.handleWidth && container.parentElement.offsetWidth !== state.lastWidth) ||
      (props.handleHeight && container.parentElement.offsetHeight !== state.lastHeight)
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
      <div style={parentStyle} ref="container">
        <div style={parentStyle} onScroll={this.handleScroll} ref="expand">
          <div style={expandStyle} />
        </div>
        <div style={parentStyle} onScroll={this.handleScroll} ref="shrink">
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
