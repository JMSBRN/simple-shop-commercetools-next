import { mockUseRouter, renderWithProviders } from '@/tests/utilsForTests';
import Footer from './Footer';
import { CommonType } from 'types';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: CommonType) => key }),
}));

mockUseRouter();
const renderFooter = () => {
    const { getByTestId, asFragment } = renderWithProviders(<Footer />);
    return {
        getByTestId,
        asFragment
    }
};

describe('Footer Component', () => {
    test('renders Footer component', () => {
        const { getByTestId } = renderFooter();
        expect(getByTestId('footer')).toBeInTheDocument();
    });

    test('renders MainLogo component inside Footer', () => {
        const { getByTestId } = renderFooter();
        expect(getByTestId('main-logo')).toBeInTheDocument();
    });

    test('renders Categories component inside Footer', () => {
        const { getByTestId } = renderFooter();
        expect(getByTestId('categories')).toBeInTheDocument();
    });

    test('renders SocialLinks component inside Footer', () => {
        const { getByTestId } = renderFooter();
        expect(getByTestId('social-links')).toBeInTheDocument();
    });

    test('matches snapshot', () => {
        const { asFragment } = renderFooter();
        expect(asFragment()).toMatchSnapshot();
    });
});
