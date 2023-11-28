import { renderWithProviders } from '@/tests/utilsForTests';
import Categories from './Categories';
import { act, fireEvent } from '@testing-library/react';
import { mockCategories } from '@/tests/mocks/mockCategories';
import { CommonType } from 'types';
import { RootState } from '@/store/store';
import { Cart } from '@commercetools/platform-sdk';
import { PartialCommerceToolsState } from '@/interfaces';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: CommonType) => key }),
}));

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

const useRouter = jest.spyOn(require('next/router'), 'useRouter');
useRouter.mockImplementation(() => useRouterMock);

const renderCategories = (customState: PartialCommerceToolsState = {}) => {
  const defaultState: RootState = {
    commercetools: {
      language: 'en',
      country: 'en',
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
      ...customState,
    },
  };

  return renderWithProviders(<Categories />, {
    preloadedState: defaultState,
  });
};

describe('render <Categories />', () => {
  test('should render correctly', async () => {
    const { getByText, getByTestId } = renderCategories();
    const category_1 = getByText('Mock Category 1');
    const category_2 = getByText('Mock Category 2');
    const dashboard = getByTestId('dashboard');

    await act(async () => {
      expect(category_1).toBeInTheDocument();
      expect(category_2).toBeInTheDocument();
      expect(dashboard).toBeInTheDocument();
    });

    fireEvent.click(category_1);
    expect(useRouter).toHaveBeenCalledTimes(1);
    fireEvent.click(dashboard);
    expect(useRouter).toHaveBeenCalledTimes(1);
  });

  test('dashboard should not render with empty userName', async () => {
    const { queryByTestId } = renderCategories({ userName: '' });
    const dashboard = queryByTestId('dashboard');

    await act(async () => {
      expect(dashboard).not.toBeInTheDocument();
    });
  });
});
