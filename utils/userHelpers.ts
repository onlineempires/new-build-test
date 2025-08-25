// User safety helper utilities to prevent undefined access errors

export interface User {
  id: number;
  name: string;
  email?: string;
  avatarUrl?: string;
}

export const getUserDisplayName = (user?: User | null): string => {
  return user?.name || 'Guest User';
};

export const getUserInitial = (user?: User | null): string => {
  return user?.name?.charAt(0)?.toUpperCase() || 'U';
};

export const getUserEmail = (user?: User | null): string => {
  return user?.email || 'guest@example.com';
};

export const getUserAvatar = (user?: User | null): string => {
  return user?.avatarUrl || '';
};

export const createDefaultUser = (): User => ({
  id: 0,
  name: 'Guest User',
  email: 'guest@example.com',
  avatarUrl: ''
});

export const isValidUser = (user?: User | null): user is User => {
  return Boolean(user && user.id && user.name);
};

// Safe user access wrapper for components
export const withUserSafety = <T extends { user?: User | null }>(
  Component: React.ComponentType<T>
): React.ComponentType<T> => {
  return (props: T) => {
    const safeProps = {
      ...props,
      user: props.user || createDefaultUser()
    };
    return React.createElement(Component, safeProps);
  };
};