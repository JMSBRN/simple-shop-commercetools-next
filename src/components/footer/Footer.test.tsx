import { mockUseRouter, renderWithProviders } from '@/tests/utilsForTests';
import { CommonType } from 'types';
import Footer from './Footer';
import { screen } from '@testing-library/react';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: CommonType) => key }),
}));

mockUseRouter();
const renderFooter = () => {
    const { asFragment } = renderWithProviders(<Footer />);

    return {
        asFragment
    };
};

describe('Footer Component', () => {
    test('renders Footer component', () => {
        renderFooter();

        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    test('renders MainLogo component inside Footer', () => {
        renderFooter();

        expect(screen.getByTestId('main-logo')).toBeInTheDocument();
    });

    test('renders Categories component inside Footer', () => {
        renderFooter();

        expect(screen.getByTestId('categories')).toBeInTheDocument();
    });

    test('renders SocialLinks component inside Footer', () => {
        renderFooter();

        expect(screen.getByTestId('social-links')).toBeInTheDocument();
    });

    test('matches snapshot', () => {
        const { asFragment } = renderFooter();

        expect(asFragment()).toMatchSnapshot();
    });
});
