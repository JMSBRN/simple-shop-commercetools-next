import { mockUseRouter, renderWithProviders } from "@/tests/utilsForTests";
import Header from "./Header";
import { CommonType } from "types";

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: CommonType) => key }),
  }));
  mockUseRouter();

describe('Header component', () => {
    const renderHeader = () => {
       const { getByTestId } = renderWithProviders(<Header/>)
       return {
        getByTestId
       }
    };
    test('renders  Header component', () => {
        const { getByTestId } = renderHeader()
        expect(getByTestId('header')).toBeInTheDocument();
    });
});