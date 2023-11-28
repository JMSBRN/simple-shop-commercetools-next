import { renderWithProviders } from "@/tests/utilsForTests";
import MainLogo from "./MainLogo";

describe('MainLogo component', () => {
    test('render component correctly with text ', () => {
        const { getByText } = renderWithProviders(<MainLogo />);
        expect(getByText(/store/i)).toBeInTheDocument();
        expect(getByText(/international/i)).toBeInTheDocument();
    })
});