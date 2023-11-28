import MainLogo from './MainLogo';
import { renderWithProviders } from '@/tests/utilsForTests';
import { screen } from '@testing-library/react';

describe('MainLogo component', () => {
    test('render component correctly with text ', () => {
        renderWithProviders(<MainLogo />);
        expect(screen.getByText(/store/i)).toBeInTheDocument();
        expect(screen.getByText(/international/i)).toBeInTheDocument();
    });
});