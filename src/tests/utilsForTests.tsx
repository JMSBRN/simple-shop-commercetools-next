import { AppStore, RootState, setupStore } from '@/store/store';
import React, { PropsWithChildren } from 'react';
import { RenderOptions, render } from '@testing-library/react';
import { Cart } from '@commercetools/platform-sdk';
import { CommerceToolsSliceInitialState } from '@/features/commerceTools/CommerceToolsSlice';
import { CommonType } from 'types';
import { PartialCommerceToolsState } from '@/interfaces';
import type { PreloadedState } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { mockCategories } from './mocks/mockCategories';

export const mockUseTranslation = () => {
  jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: CommonType) => key }),
  }));
};

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}
export const renderWithProviders = (
  ui: React.ReactElement,
  {
    preloadedState = {
      commercetools: {} as CommerceToolsSliceInitialState,
    },
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) => {
  jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: CommonType) => key }),
  }));

  const Wrapper = ({
    children,
  }: PropsWithChildren<Record<string, unknown>>): JSX.Element => {
    return <Provider store={store}>{children}</Provider>;
  };

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

export const mockUseRouter = () => {
  const useRouterMock = {
    route: '/',
    pathname: '',
    query: '',
    asPath: '',
    push: jest.fn(),
    events: { on: jest.fn(), off: jest.fn() },
    beforePopState: jest.fn(() => null),
    prefetch: jest.fn(() => null),
  };

  const useRouterWithMockEmplement = jest.spyOn(
    require('next/router'),
    'useRouter'
  );

  useRouterWithMockEmplement.mockImplementation(() => useRouterMock);
  return { useRouterWithMockEmplement };
};

export const renderWithPreloadState = (
  ui: React.ReactElement,
  customState?: PartialCommerceToolsState
) => {
  const defaultState: RootState = {
    commercetools: {
      language: 'en',
      country: 'en',
      countries: [],
      categories: mockCategories,
      products: [],
      orders: [],
      status: 'succeeded',
      errorMessage: '',
      shoppingLists: [],
      cart: {} as Cart,
      carts: [],
      payments: [],
      userName: 'MockUser',
      ...(customState || ({} as PartialCommerceToolsState)),
    },
  };

  return renderWithProviders(ui, {
    preloadedState: defaultState,
  });
};
