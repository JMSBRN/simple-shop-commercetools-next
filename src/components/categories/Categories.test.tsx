import { mockUseRouter, renderWithPreloadState } from '@/tests/utilsForTests';
import Categories from './Categories';
import { act, fireEvent } from '@testing-library/react';
import { CommonType } from 'types';
import { PartialCommerceToolsState } from '@/interfaces';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: CommonType) => key }),
}));

const { useRouterWithMockEmplement } = mockUseRouter();

const renderCategories = (customState: PartialCommerceToolsState = {}) => {
  return renderWithPreloadState(<Categories />, customState);
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
    expect(useRouterWithMockEmplement).toHaveBeenCalledTimes(1);
    fireEvent.click(dashboard);
    expect(useRouterWithMockEmplement).toHaveBeenCalledTimes(1);
  });

  test('dashboard should not render with empty userName', async () => {
    const { queryByTestId } = renderCategories({ userName: '' });
    const dashboard = queryByTestId('dashboard');

    await act(async () => {
      expect(dashboard).not.toBeInTheDocument();
    });
  });
});
