import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

import './styles/globals.css';
import { TanstackQueryProvider } from './providers/TanstackQueryProvider';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <TanstackQueryProvider>
        <RouterProvider router={router} />
      </TanstackQueryProvider>
    </React.StrictMode>,
  );
}
