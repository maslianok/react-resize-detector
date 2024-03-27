import * as ReactDOMClient from 'react-dom/client';
import { Flex, Theme } from '@radix-ui/themes';

import { DemoProvider } from './context';
import { Sidebar } from './Sidebar';
import { MainFrame } from './MainFrame';

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
        <MainFrame />
      </Flex>
    </DemoProvider>
  </Theme>,
);
