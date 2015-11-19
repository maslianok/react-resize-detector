import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';

import {parentStyle, shrinkChildStyle, expandChildStyle} from '../helpers/resizeDetectorStyles';

export default class ResizeDetector extends Component {

  constructor(props) {
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

  shouldComponentUpdate(nextProps, nextState) {
    return this.props != nextProps;
  }

  componentDidMount() {
    this.reset();
  }

  reset() {
    const {
      expand,
      shrink,
      container,
      props
    } = this;

    this.setState({
      expandChildHeight: props.handleHeight && (expand.offsetHeight + 10),
      expandChildWidth: props.handleWidth && (expand.offsetWidth + 10),
      lastWidth: props.handleWidth && container.parentElement.offsetWidth,
      lastHeight: props.handleHeight && container.parentElement.offsetHeight,
    });

    // expand.scrollLeft = expand.scrollWidth;
    // expand.scrollTop = expand.scrollHeight;

    // shrink.scrollLeft = shrink.scrollWidth;
    // shrink.scrollTop = shrink.scrollHeight;
  }

  handleScroll(evt) {
    const {container, state, props} = this;

    if (
      (props.handleWidth && container.parentElement.offsetWidth != state.lastWidth) ||
      (props.handleHeight && container.parentElement.offsetHeight != state.lastHeight)
    ) {
      this.props.onResize();
    }

    this.reset();
  }

  render() {
    const {state} = this;

    const expandStyle = {
      ...expandChildStyle,
      width: state.expandChildWidth,
      height: state.expandChildHeight,
    };

    return (
      <resize-sensor style={parentStyle} ref={(ref) => {this.container = findDOMNode(ref)}}>
        <expand style={parentStyle} onScroll={this.handleScroll} ref={(ref) => {this.expand = findDOMNode(ref)}}>
          <expand-child style={expandStyle}/>
        </expand>
        <shrink style={parentStyle} onScroll={this.handleScroll} ref={(ref) => {this.shrink = findDOMNode(ref)}}>
          <shrink-child style={shrinkChildStyle}/>
        </shrink>
      </resize-sensor>
    );
  }
}

ResizeDetector.propTypes = {
  handleWidth: PropTypes.bool,
  handleHeight: PropTypes.bool,
  onResize: PropTypes.func.isRequired
};

ResizeDetector.defaultProps = {
  handleWidth: false,
  handleHeight: false,
  onResize: () => console.error('ResizeDetector:onResize')
};
