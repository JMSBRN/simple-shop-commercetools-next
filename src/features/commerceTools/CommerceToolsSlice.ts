import {
  Cart,
  Category,
  Order,
  Payment,
  Product,
  ShoppingList,
} from '@commercetools/platform-sdk';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import { ThunkStatus } from '@/interfaces';
import { fetchCarts } from '../thunks/FetchCarts';
import { fetchCategories } from '../thunks/FetchCategories';
import { fetchCountries } from '../thunks/FetchCountries';
import { fetchOrders } from '../thunks/FetchOrders';
import { fetchPayments } from '../thunks/FetchPayments';
import { fetchProducts } from '../thunks/FetchProducts';
import { fetchShoppingLists } from '../thunks/FetchShoppingLists';

export interface CommerceToolsSliceInitialState {
  language: string;
  country: string;
  countries: string[];
  categories: Category[];
  products: Product[];
  orders: Order[];
  status: ThunkStatus;
  errorMessage: string;
  shoppingLists: ShoppingList[];
  cart: Cart;
  carts: Cart[];
  payments: Payment[];
  userName: string;
}
const initialState: CommerceToolsSliceInitialState = {
  language: '',
  country: '',
  countries: [],
  categories: [],
  products: [],
  orders: [] as Order[],
  status: 'idle',
  errorMessage: '',
  shoppingLists: [],
  cart: {} as Cart,
  carts: [] as Cart[],
  payments: [] as Payment[],
  userName: '',
};
const commerceToolseSlice = createSlice({
  name: 'commercetools',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setCountry: (state, action: PayloadAction<string>) => {
      state.country = action.payload;
    },
    setCountries: (state, action: PayloadAction<string[]>) => {
      state.countries = action.payload;
    },
    setShoppingLists: (state, action: PayloadAction<ShoppingList[]>) => {
      state.shoppingLists = action.payload;
    },
    setCarts: (state, action: PayloadAction<Cart[]>) => {
      state.carts = action.payload;
    },
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    setPayments: (state, action: PayloadAction<Payment[]>) => {
      state.payments = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    setErrorMessage: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.countries = action.payload;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchShoppingLists.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.shoppingLists = action.payload;
      })
      .addCase(fetchCarts.pending, (state) => {
        state.status = 'loading';     
      })
      .addCase(fetchCarts.fulfilled, (state, action) => {
        state.status = 'succeeded';     
        state.carts = action.payload;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.payments = action.payload;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      });
  },
});

export const {
  setCountries,
  setCategories,
  setProducts,
  setOrders,
  setLanguage,
  setCountry,
  setShoppingLists,
  setCarts,
  setPayments,
  setUserName,
  setErrorMessage
} = commerceToolseSlice.actions;
export const selectCommerceTools = (state: RootState) => state.commercetools;
export default commerceToolseSlice.reducer;
