import * as React from 'react';
import { Component, createRef, forwardRef, ComponentType, ForwardedRef, MutableRefObject } from 'react';

import ResizeDetector, { ComponentsProps } from './ResizeDetector';

function withResizeDetector<P, ElementT extends HTMLElement = HTMLElement>(
  ComponentInner: ComponentType<P>,
  options: ComponentsProps<ElementT> = {},
) {
  class ResizeDetectorHOC extends Component<P & { forwardedRef: ForwardedRef<HTMLElement> }> {
    ref = createRef<HTMLElement>();

    render() {
      const { forwardedRef, ...rest } = this.props;
      const targetRef = forwardedRef ?? this.ref;

      return (
        <ResizeDetector {...options} targetRef={targetRef as MutableRefObject<HTMLElement>}>
          <ComponentInner targetRef={targetRef} {...(rest as P)} />
        </ResizeDetector>
      );
    }
  }

  function forwardRefWrapper(props: P, ref: ForwardedRef<HTMLElement>) {
    return <ResizeDetectorHOC {...props} forwardedRef={ref} />;
  }

  const name = ComponentInner.displayName || ComponentInner.name;
  forwardRefWrapper.displayName = `withResizeDetector(${name})`;

  return forwardRef(forwardRefWrapper);
}

export default withResizeDetector;
