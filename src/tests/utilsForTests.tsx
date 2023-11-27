import { CommonType } from 'types';
import React, { PropsWithChildren } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AppStore, RootState, setupStore } from '@/store/store';
import type { PreloadedState } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { CommerceToolsSliceInitialState } from '@/features/commerceTools/CommerceToolsSlice';
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
      commercetools: {} as CommerceToolsSliceInitialState
    },
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) => {
  mockUseTranslation();
  
  const Wrapper = ({ children }: PropsWithChildren<Record<string, unknown>>): JSX.Element => {
    return <Provider store={store}>{children}</Provider>;
  };
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};