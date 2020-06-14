import React, { createRef, forwardRef } from 'react';
import { shape, func, oneOfType, instanceOf } from 'prop-types';

import ResizeDetector from 'components/ResizeDetector';

function withResizeDetector(Component, options = { handleWidth: true, handleHeight: true }) {
  class ResizeDetectorHOC extends React.Component {
    ref = createRef();

    render() {
      const { forwardedRef, ...rest } = this.props;
      const targetRef = forwardedRef || this.ref;

      return (
        <ResizeDetector {...options} targetRef={targetRef}>
          <Component targetRef={targetRef} {...rest} />
        </ResizeDetector>
      );
    }
  }

  function forwardRefWrapper(props, ref) {
    return <ResizeDetectorHOC {...props} forwardedRef={ref} />;
  }

  const name = Component.displayName || Component.name;
  forwardRefWrapper.displayName = `withResizeDetector(${name})`;

  ResizeDetectorHOC.propTypes = {
    forwardedRef: oneOfType([func, shape({ current: instanceOf(Element) })])
  };

  ResizeDetectorHOC.defaultProps = {
    forwardedRef: undefined
  };

  return forwardRef(forwardRefWrapper);
}

export default withResizeDetector;
