import React, { Component } from 'react';
import ResizeDetector from 'components/ResizeDetector';

const withResizeDetector = (
  WrappedComponent,
  props = { handleWidth: true, handleHeight: true },
) =>
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

export default withResizeDetector;
