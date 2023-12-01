import { fireEvent, screen, waitFor } from '@testing-library/react';
import CountrySelect from './CountrySelect';
import { PartialCommerceToolsState } from '@/interfaces';
import { mockCarts } from '@/tests/mocks/mockCarts';
import { renderWithPreloadState } from '@/tests/utilsForTests';

beforeEach(() => {
  jest.resetAllMocks();
});

const renderCountrySelect = (customState?: PartialCommerceToolsState) => {
  renderWithPreloadState(
    <CountrySelect textMessage="Mock text for CountrySelect" label="Mock label" />,
    customState
  );
};

describe('CountrySelect component', () => {
  test('renders CountrySelect with carts', async () => {
    
    renderCountrySelect({
      carts: mockCarts,
      countries: ['en-GB', 'fr-FR']
    });
    
    expect(screen.getByTestId('select-country')).toBeInTheDocument();
    expect(screen.queryByTestId('custom-select')).not.toBeInTheDocument();
    expect(screen.getByTestId('selected-country')).toBeInTheDocument();
    expect(screen.getByText('Mock label')).toBeInTheDocument();
    expect(screen.getByText('GB')).toBeInTheDocument();
  });
  
  test('renders CountrySelect without carts', async () => {
    renderCountrySelect({
      carts: [],
      countries: ['en-Gb', 'fr-FR'],
    });

    expect(screen.getByTestId('select-country')).toBeInTheDocument();
    expect(screen.getByTestId('custom-select')).toBeInTheDocument();
    expect(screen.getByTestId('selected-option')).toBeInTheDocument();
    expect(screen.getByText('Mock text for CountrySelect')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('selected-option'));

    await waitFor(() => {
      expect(screen.getByTestId('selected-option')).toHaveTextContent(
        JSON.parse(window.localStorage.getItem('counstry') || '"GB"')
      );
    });
  });
});

