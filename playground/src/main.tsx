import * as ReactDOMClient from 'react-dom/client';
import { Flex, Theme } from '@radix-ui/themes';

import { DemoProvider } from './context';
import { Sidebar } from './Sidebar';
import { ResizeCard } from './ResizeCard';
import { BackgroundImage } from './BackgroundImage';

import '@radix-ui/themes/styles.css';
import './index.css';

const root = ReactDOMClient.createRoot(document.getElementById('root')!);

root.render(
  <Theme>
    <DemoProvider>
      <Flex
        height={{
          initial: 'auto',
          sm: '100vh',
        }}
        width="100%"
        overflow="hidden"
        position="relative"
        direction={{
          initial: 'column-reverse',
          sm: 'row',
        }}
      >
        <Sidebar />
        <main>
          <Flex align="center" justify="center" overflow="hidden" position="absolute" inset="0">
            <BackgroundImage />
          </Flex>
          <ResizeCard />
        </main>
      </Flex>
    </DemoProvider>
  </Theme>,
);
