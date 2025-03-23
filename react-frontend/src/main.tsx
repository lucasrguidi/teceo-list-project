import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

import './styles/globals.css';
import { TanstackQueryProvider } from './providers/TanstackQueryProvider';
import { NotificationProvider } from './providers/NotificationsProvider';

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
        <NotificationProvider>
          <RouterProvider router={router} />
        </NotificationProvider>
      </TanstackQueryProvider>
    </React.StrictMode>,
  );
}
