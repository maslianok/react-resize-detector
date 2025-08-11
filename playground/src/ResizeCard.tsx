import { useState } from 'react';

import { Card, Code, Flex, Heading, Text, Spinner } from '@radix-ui/themes';

// 1) Import `useResizeDetector` hook from 'react-resize-detector'
import { useResizeDetector } from 'react-resize-detector';

import { useDemoContext } from './context';
import { DimensionsTooltip, getDimensions, useDimensions } from './useDimensions';

export const ResizeCard = () => {
  const [dimensions, setDimensions] = useDimensions();

  const [count, setCount] = useState(0);
  const { refreshMode, box, handleHeight, handleWidth, isLoading, disableRerender } = useDemoContext();

  // 2) Call `useResizeDetector` to get dimensions of the element.
  // It will return `width` and `height` of the element in pixels.
  // You need to pass a `ref` to the element you want to observe.
  const { ref, width, height } = useResizeDetector<HTMLDivElement>({
    // 3) You can customize `useResizeDetector` behavior by overriding default options.
    // For example, you can throttle the refresh rate of the resize event

    // Limit the refresh rate of the resize event.
    // Refs: https://lodash.com/docs#debounce
    refreshMode,
    refreshRate: 200,

    // If you only need to observe the width or height, you can disable the other dimension
    handleHeight,
    handleWidth,

    // Disable re-renders triggered by the hook. When true, only the onResize callback will be called.
    // This is useful when you want to handle resize events without causing component re-renders.
    disableRerender,

    // You can pass additional options directly to the ResizeObserver
    // For example, you can change the box model used to calculate the dimensions
    // By default padding and border are not included in the dimensions
    observerOptions: {
      box,
    },

    // You can attach a side effect to the resize event
    // For example, count the number of times the element has been resized
    onResize: ({ width, height, entry }) => {
      if (width && height) {
        setCount((count) => count + 1);
        setDimensions(getDimensions(entry));
      }
    },

    // For the full list of options, see the API section in the README:
    // https://github.com/maslianok/react-resize-detector/tree/master?tab=readme-ov-file#api
  });

  // 4) `useResizeDetector` supports dynamic ref change. It's useful when you
  // need to use conditional rendering or when the ref is not available immediately.
  if (isLoading) {
    return (
      <Flex align="center" justify="center" overflow="hidden" position="absolute" inset="0">
        <Spinner size="3" />
      </Flex>
    );
  }

  return (
    <Card
      size="4"
      // 5) Attach the `ref` to the element you want to observe.
      ref={ref}
    >
      <div className="highlight" key={count} />
      <div className="inner">
        <Heading mb="2">
          Card resized <i>{count}</i> times
        </Heading>
        <Text color="pink" highContrast as="p">
          Width:{' '}
          <DimensionsTooltip dimensions={dimensions} orientation="horizontal">
            <Code>{width}px</Code>
          </DimensionsTooltip>
          , Height:{' '}
          <DimensionsTooltip dimensions={dimensions} orientation="vertical">
            <Code>{height}px</Code>
          </DimensionsTooltip>
        </Text>
      </div>
    </Card>
  );
};
