import { renderWithProviders } from "@/tests/utilsForTests";
import Categories from "./Categories";
import { Cart } from "@commercetools/platform-sdk";
import { mockCategories } from "@/tests/mocks/mockCategories";
import { act } from "react-dom/test-utils";
import { CommonType } from "types";

jest.mock('next/router', () => ({
    useRouter() {
      return ({
        route: '/',
        pathname: '',
        query: '',
        asPath: '',
        push: jest.fn(),
        events: {
          on: jest.fn(),
          off: jest.fn()
        },
        beforePopState: jest.fn(() => null),
        prefetch: jest.fn(() => null)
      });
    },
  }));
  jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: CommonType) => key }),
  }));

describe('render <Categories />', () => {
    test('should be render correctly', async () => {
       const { getByText, getByTestId } =  renderWithProviders(<Categories />, {
            preloadedState: {
                commercetools: {
                    language: "en",
                    country: "en",
                    categories: mockCategories,
                    products: [],
                    orders: [],
                    status: "succeeded",
                    errorMessage: "",
                    shoppingLists: [],
                    cart: {} as Cart,
                    carts: [],
                    payments: [],
                    userName: "MockUser"
                }
            }
        });
        const category_1 = getByText('Mock Category 1');
        const category_2 = getByText('Mock Category 2');
        const dashboard = getByTestId('dashboard');

        await act( async ()=> {
            expect(category_1).toBeInTheDocument();
            expect(category_2).toBeInTheDocument();
            expect(dashboard).toBeInTheDocument();
        })
     });
});