declare module 'sectei-library' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export const Button: ComponentType<{
    type?: 'button' | 'submit' | 'reset';
    variant?: string;
    size?: string;
    icon?: string;
    iconOnly?: boolean;
    href?: string;
    disabled?: boolean;
    className?: string;
    tabIndex?: number;
    'aria-label'?: string;
    onClick?: (event: unknown) => void;
    children?: ReactNode;
    [key: string]: unknown;
  }>;

  export const MainNav: ComponentType<{
    className?: string;
    identity?: ReactNode;
    complementary?: ReactNode;
    navInfo?: string;
    navWidth?: number;
    children?: ReactNode | ((api: { closeMenuAndSubmenu: () => void }) => ReactNode);
    [key: string]: unknown;
  }>;

  export const SearchField: ComponentType<{
    catalog?: unknown[];
    searchProperty?: string;
    placeholder?: string;
    id?: string;
    disabled?: boolean;
    className?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onFilter?: (filtered: any[]) => void;
    onSearch?: (query: string, filtered: any[]) => void;
    [key: string]: unknown;
  }>;

  export const Card: ComponentType<{
    variant?: string;
    horizontal?: boolean;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
    [key: string]: unknown;
  }>;

  export function filterCatalog(
    catalog: unknown[],
    query: string,
    options?: {
      nested?: boolean;
      nestedItemsProperty?: string;
      searchProperty?: string;
    },
  ): unknown[];
}

declare module 'sectei-library/style.css';
