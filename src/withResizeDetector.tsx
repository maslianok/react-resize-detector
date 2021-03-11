import React, { Component, createRef, forwardRef, ComponentType, ForwardedRef, ReactElement, RefObject } from 'react';

import ResizeDetector, { Props, ComponentsProps } from './ResizeDetector';

type WithForwardedRef = {
  forwardedRef?: ForwardedRef<HTMLElement>;
};

export interface HOCProps extends Props {
  forwardedRef?: RefObject<HTMLElement>;
}

const wrapperForwardRef = parms => forwardRef<HTMLElement>(parms);

function withResizeDetector<P>(
  ComponentInner: ComponentType<Omit<P, 'forwardedRef'>>,
  options: ComponentsProps = {}
): ReturnType<typeof wrapperForwardRef> {
  class ResizeDetectorHOC extends Component<P & WithForwardedRef> {
    ref = createRef<HTMLElement>();

    render() {
      const { forwardedRef, ...rest } = this.props;
      const targetRef = forwardedRef || this.ref;

      return (
        <ResizeDetector {...options} targetRef={targetRef as RefObject<HTMLElement>}>
          <ComponentInner targetRef={targetRef} {...rest} />
        </ResizeDetector>
      );
    }
  }

  function forwardRefWrapper(props, ref: ForwardedRef<HTMLElement>): ReactElement {
    return <ResizeDetectorHOC {...props} forwardedRef={ref} />;
  }

  const name = ComponentInner.displayName || ComponentInner.name;
  forwardRefWrapper.displayName = `withResizeDetector(${name})`;

  return forwardRef(forwardRefWrapper);
}

export default withResizeDetector;
