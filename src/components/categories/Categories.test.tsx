import { act, fireEvent, screen } from '@testing-library/react';
import { mockUseRouter, renderWithPreloadState } from '@/tests/utilsForTests';
import Categories from './Categories';
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
    renderCategories();
    const category_1 = screen.getByText('Mock Category 1');
    const category_2 = screen.getByText('Mock Category 2');
    const dashboard = screen.getByTestId('dashboard');

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
    renderCategories({ userName: '' });
    const dashboard = screen.queryByTestId('dashboard');

    await act(async () => {
      expect(dashboard).not.toBeInTheDocument();
    });
  });
});
