import { NotificationsProvider } from '@toolpad/core';

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <NotificationsProvider
      slotProps={{
        snackbar: {
          anchorOrigin: {
            horizontal: 'right',
            vertical: 'bottom',
          },
        },
      }}
    >
      {children}
    </NotificationsProvider>
  );
};
