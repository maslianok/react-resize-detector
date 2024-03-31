import { useState } from 'react';
import { Card, Code, DataList, Flex, Heading, Text, Spinner, Tooltip, Theme } from '@radix-ui/themes';

export interface TRBL {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface Dimensions {
  border: TRBL;
  padding: TRBL;
  inner: {
    width: number;
    height: number;
  };
}

const defaultValue: TRBL = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

// You can use the `ResizeObserverEntry` returned in the `onResize` callback to calculate border and padding dimensions of the element.
//
export const getDimensions = (entry: ResizeObserverEntry): Dimensions => {
  const style = getComputedStyle(entry.target);

  // Get the border and padding dimensions of the element
  const border = {
    top: parseFloat(style.borderTopWidth),
    right: parseFloat(style.borderRightWidth),
    bottom: parseFloat(style.borderBottomWidth),
    left: parseFloat(style.borderLeftWidth),
  };
  const padding = {
    top: parseFloat(style.paddingTop),
    right: parseFloat(style.paddingRight),
    bottom: parseFloat(style.paddingBottom),
    left: parseFloat(style.paddingLeft),
  };

  // You can calculate the inner content dimensions by subtracting the border and padding from the content box size,
  // Or you can use the `contentBoxSize` property of the `ResizeObserverEntry` object directly.
  const inner = {
    width: entry.contentBoxSize[0].inlineSize,
    height: entry.contentBoxSize[0].blockSize,
  };

  return {
    border,
    padding,
    inner,
  };
};

export const useDimensions = () =>
  useState<Dimensions>({
    border: defaultValue,
    padding: defaultValue,
    inner: {
      width: 0,
      height: 0,
    },
  });

export const DimensionsTooltip = ({
  dimensions,
  children,
  orientation,
}: {
  dimensions: Dimensions;
  children: React.ReactNode;
  orientation: 'horizontal' | 'vertical';
}) => {
  if (orientation === 'horizontal') {
    return (
      <Tooltip
        content={
          <Theme appearance="dark" hasBackground={false} asChild>
            <DataList.Root m="2" size="1">
              <DataList.Item>
                <DataList.Label>Border left:</DataList.Label>
                <DataList.Value>
                  <Code color="orange">{dimensions.border.left}px</Code>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>Padding left:</DataList.Label>
                <DataList.Value>
                  <Code color="green">{dimensions.padding.left}px</Code>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>Inner width:</DataList.Label>
                <DataList.Value>
                  <Code color="blue">{dimensions.inner.width}px</Code>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>Padding right:</DataList.Label>
                <DataList.Value>
                  <Code color="green">{dimensions.padding.right}px</Code>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label>Border right:</DataList.Label>
                <DataList.Value>
                  <Code color="orange">{dimensions.border.right}px</Code>
                </DataList.Value>
              </DataList.Item>
            </DataList.Root>
          </Theme>
        }
      >
        {children}
      </Tooltip>
    );
  }

  return (
    <Tooltip
      content={
        <Theme appearance="dark" hasBackground={false} asChild>
          <DataList.Root m="2" size="1">
            <DataList.Item>
              <DataList.Label>Border top:</DataList.Label>
              <DataList.Value>
                <Code color="orange">{dimensions.border.top}px</Code>
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Padding top:</DataList.Label>
              <DataList.Value>
                <Code color="green">{dimensions.padding.top}px</Code>
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Inner height:</DataList.Label>
              <DataList.Value>
                <Code color="blue">{dimensions.inner.height}px</Code>
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Padding bottom:</DataList.Label>
              <DataList.Value>
                <Code color="green">{dimensions.padding.bottom}px</Code>
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Border bottom:</DataList.Label>
              <DataList.Value>
                <Code color="orange">{dimensions.border.bottom}px</Code>
              </DataList.Value>
            </DataList.Item>
          </DataList.Root>
        </Theme>
      }
    >
      {children}
    </Tooltip>
  );
};
