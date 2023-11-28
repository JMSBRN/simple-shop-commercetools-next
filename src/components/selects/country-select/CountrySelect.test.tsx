import { fireEvent, screen, waitFor } from '@testing-library/react';
import CountrySelect from './CountrySelect';
import { PartialCommerceToolsState } from '@/interfaces';
import { act } from 'react-dom/test-utils';
import { getCountries } from '@/commercetools/utils/utilsCommercTools';
import { mockCarts } from '@/tests/mocks/mockCarts';
import { renderWithPreloadState } from '@/tests/utilsForTests';

jest.mock('@/commercetools/utils/utilsCommercTools', () => ({
  getCountries: jest.fn<Promise<string[]>, []>(),
}));

const renderCountrySelect = (customState?: PartialCommerceToolsState) => {
  const { getByTestId, queryByTestId, getByText } = renderWithPreloadState(
    <CountrySelect selectCountryText="Mock text for CountrySelect" />,
    customState
  );

  return {
    getByTestId,
    queryByTestId,
    getByText,
  };
};

describe('ContrySelect component', () => {
  test('render CountrySelect with carts', async () => {
    (getCountries as jest.Mock).mockResolvedValue(['en-US', 'fr-FR']);
     renderCountrySelect({
      carts: mockCarts,
      country: 'en-GB',
    });

    await act(async () => {
      expect(screen.getByTestId('select-country')).toBeInTheDocument();
      expect(screen.queryByTestId('custom-select')).not.toBeInTheDocument();
      expect(screen.getByTestId('selected-country')).toBeInTheDocument();
    });
  });
  test('render CountrySelect without carts', async () => {
    renderCountrySelect({
      carts: [],
    });

    await act(async () => {
      expect(screen.getByTestId('select-country')).toBeInTheDocument();
      expect(screen.getByTestId('custom-select')).toBeInTheDocument();
      expect(screen.getByTestId('selected-option')).toBeInTheDocument();
      expect(screen.getByText('Mock text for CountrySelect')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('selected-option'));

    await waitFor(() => {
      expect(screen.getByTestId('selected-option')).toHaveTextContent('GB');
    });
  });
});
