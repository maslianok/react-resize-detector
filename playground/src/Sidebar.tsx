import { useCallback } from 'react';

import {
  Button,
  Code,
  Flex,
  Heading,
  Link,
  Tabs,
  Text,
  Theme,
  RadioCards,
  Switch,
  Spinner,
  ScrollArea,
  Badge,
  Table,
  Tooltip,
  Callout,
} from '@radix-ui/themes';
import { Github, MessageCircleQuestion, Rocket, WandSparkles } from 'lucide-react';

import { Box, RefreshModeType, useDemoContext } from './context';
import { Snippet } from './Snippet';

export const Sidebar = () => {
  const {
    box,
    setBox,
    refreshMode,
    setRefreshMode,
    handleHeight,
    setHandleHeight,
    handleWidth,
    setHandleWidth,
    isLoading,
    setIsLoading,
  } = useDemoContext();

  const toggleLoading = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  return (
    <Theme appearance="dark" asChild>
      <nav>
        <ScrollArea type="auto" scrollbars="vertical">
          <Flex py="6" px="4" gap="6" direction="column">
            <Flex gap="4" direction="column">
              <Heading size="6">react-resize-detector Playground</Heading>

              <Flex>
                <Badge radius="full" size="2" color="gray" asChild>
                  <a href="https://github.com/maslianok/react-resize-detector" target="_blank" rel="noreferrer">
                    <Github size="16" /> maslianok/react-resize-detector
                  </a>
                </Badge>
              </Flex>

              <Flex wrap="wrap" gap="2">
                {/* version */}
                <img src="https://img.shields.io/npm/v/react-resize-detector?style=flat-square" />
                {/* MIT */}
                <img src="https://img.shields.io/npm/l/react-resize-detector?style=flat-square" />
                {/* npm downloads */}
                <img src="https://img.shields.io/npm/dm/react-resize-detector?style=flat-square" />
                {/* size */}
                <img src="https://img.shields.io/bundlejs/size/react-resize-detector?style=flat-square" />
              </Flex>

              <Text as="p">
                Harnesses the power of{' '}
                <Link href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver">ResizeObservers</Link>, a
                feature in modern browsers that can detect when elements change size. <Code>useResizeDetector</Code>{' '}
                hook makes it easy to manage these size changes within React applications, ensuring smooth and
                responsive user experiences.
              </Text>

              <Tabs.Root defaultValue="npm">
                <Tabs.List>
                  <Tabs.Trigger value="npm">npm</Tabs.Trigger>
                  <Tabs.Trigger value="yarn">yarn</Tabs.Trigger>
                  <Tabs.Trigger value="pnpm">pnpm</Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="npm">
                  <Snippet code="npm install react-resize-detector" />
                </Tabs.Content>

                <Tabs.Content value="yarn">
                  <Snippet code="yarn add react-resize-detector" />
                </Tabs.Content>

                <Tabs.Content value="pnpm">
                  <Snippet code="pnpm add react-resize-detector" />
                </Tabs.Content>
              </Tabs.Root>
            </Flex>

            <div>
              <Heading size="4" mb="3">
                The Box Model
              </Heading>

              <Text as="p" mb="4">
                ResizeObserver provides different{' '}
                <Link href="https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model">
                  box models
                </Link>{' '}
                to measure the size of an element. By default border and padding are <strong>not</strong> included in
                the size. You can use the <Code>box</Code> option to change this behavior.
              </Text>

              <Table.Root mb="4">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>
                      <Flex align="end" height="100%">
                        Value
                      </Flex>
                    </Table.ColumnHeaderCell>

                    <Table.ColumnHeaderCell>
                      Includes <Badge color="orange">Border</Badge>
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>
                      Includes <Badge color="green">Padding</Badge>
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>
                      Includes <Badge color="blue">Inner Content</Badge>
                    </Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  <Table.Row>
                    <Table.RowHeaderCell>
                      <Badge>undefined</Badge>
                    </Table.RowHeaderCell>
                    <Table.Cell>
                      <Text color="red">No</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Tooltip
                        content={
                          <>
                            Docs say that padding should be included by default, but{' '}
                            <Theme appearance="light" asChild>
                              <Badge>contentRect</Badge>
                            </Theme>{' '}
                            actually only includes the inner content.
                          </>
                        }
                        side="top"
                      >
                        <Text
                          color="red"
                          style={{
                            textDecoration: 'underline dotted',
                            cursor: 'help',
                          }}
                        >
                          No
                        </Text>
                      </Tooltip>
                    </Table.Cell>
                    <Table.Cell>
                      <Text color="green">Yes</Text>
                    </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.RowHeaderCell>
                      <Badge>content-box</Badge>
                    </Table.RowHeaderCell>
                    <Table.Cell>
                      <Text color="red">No</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text color="red">No</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text color="green">Yes</Text>
                    </Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.RowHeaderCell>
                      <Badge>border-box</Badge>
                    </Table.RowHeaderCell>
                    <Table.Cell>
                      <Text color="green">Yes</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text color="green">Yes</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text color="green">Yes</Text>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table.Root>

              <Flex align="center" gap="3" asChild>
                <Callout.Root mb="4" variant="surface" id="debug-hover">
                  <Callout.Icon>
                    <WandSparkles />
                  </Callout.Icon>
                  <Callout.Text>
                    <em>Hover</em> to visualize card&apos;s border / padding / inner content with a different color
                  </Callout.Text>
                </Callout.Root>
              </Flex>

              <RadioCards.Root value={box || ''} onValueChange={(v) => setBox((v || undefined) as Box)} columns="3">
                <RadioCards.Item value="">undefined (Default)</RadioCards.Item>
                <RadioCards.Item value="content-box">content-box</RadioCards.Item>
                <RadioCards.Item value="border-box">border-box</RadioCards.Item>
              </RadioCards.Root>
            </div>

            <div>
              <Heading size="4" mb="3">
                Refresh Mode
              </Heading>

              <Text as="p" mb="4">
                Uses{' '}
                <Link href="https://lodash.com/docs" target="_blank">
                  lodash
                </Link>{' '}
                to limit the amount of times the resize event can be fired per second. It&apos;s useful to prevent
                unnecessary re-renders when the user is resizing the window.
                <br />-{' '}
                <Link href="https://lodash.com/docs#throttle" target="_blank">
                  Throttle docs
                </Link>
                <br />-{' '}
                <Link href="https://lodash.com/docs#debounce" target="_blank">
                  Debounce docs
                </Link>
              </Text>

              <RadioCards.Root
                value={refreshMode || ''}
                onValueChange={(v) => setRefreshMode((v || undefined) as RefreshModeType)}
                columns="3"
              >
                <RadioCards.Item value="">No Throttle (Default)</RadioCards.Item>
                <RadioCards.Item value="throttle">Throttle</RadioCards.Item>
                <RadioCards.Item value="debounce">Debounce</RadioCards.Item>
              </RadioCards.Root>
            </div>

            <div>
              <Heading size="4" mb="3">
                Customize Axis
              </Heading>

              <Text as="p" mb="4">
                If you only need to detect changes in one axis, you can disable the other axis to improve performance.
              </Text>

              <Flex direction="column" gap="4">
                <Text as="label" size="3">
                  <Flex gap="2">
                    <Switch checked={handleWidth} onCheckedChange={setHandleWidth} /> Handle Width
                  </Flex>
                </Text>
                <Text as="label" size="3">
                  <Flex gap="2">
                    <Switch checked={handleHeight} onCheckedChange={setHandleHeight} /> Handle Height
                  </Flex>
                </Text>
              </Flex>
            </div>

            <div>
              <Heading size="4" mb="3">
                Conditional Rendering
              </Heading>

              <Text as="p" mb="4">
                <Code>useResizeDetector</Code> hook supports conditional rendering and will automatically detect{' '}
                <Code>ref</Code> changes.
              </Text>

              <Button disabled={isLoading} onClick={toggleLoading}>
                <Spinner loading={isLoading}></Spinner>
                Toggle Loading
              </Button>
            </div>

            <div>
              <Heading size="4" mb="3">
                Additional Resources
              </Heading>

              <Flex direction="column" gap="2">
                <Link href="https://github.com/maslianok/react-resize-detector/issues/new" target="_blank">
                  <Flex align="center" gap="2">
                    <MessageCircleQuestion />
                    Submit an issue / Ask a question
                  </Flex>
                </Link>
                <Link href="https://github.com/maslianok/react-resize-detector" target="_blank">
                  <Flex align="center" gap="2">
                    <Github />
                    View source code
                  </Flex>
                </Link>
                <Link href="https://github.com/maslianok/react-resize-detector/releases" target="_blank">
                  <Flex align="center" gap="2">
                    <Rocket />
                    Releases
                  </Flex>
                </Link>
              </Flex>
            </div>
          </Flex>
        </ScrollArea>
      </nav>
    </Theme>
  );
};
