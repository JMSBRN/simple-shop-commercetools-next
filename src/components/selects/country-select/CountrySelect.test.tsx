import { renderWithPreloadState } from "@/tests/utilsForTests";
import CountrySelect from "./CountrySelect";
import { mockCarts } from "@/tests/mocks/mockCarts";
import { PartialCommerceToolsState } from "@/interfaces";

const renderCountrySelect = (customState?: PartialCommerceToolsState) => {
    const { getByTestId } = renderWithPreloadState(<CountrySelect selectCountryText="Mock text for CountrySelect" />, customState);
    return {
        getByTestId
    };
};

describe('ContrySelect component', () => {
    const { getByTestId } = renderCountrySelect(
        {
            carts: mockCarts
        }
    );
    test('render CountrySelect ', () => {
       expect(getByTestId('select-country')).toBeInTheDocument();

    });
});