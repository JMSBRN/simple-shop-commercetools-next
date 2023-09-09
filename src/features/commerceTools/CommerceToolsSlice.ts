import { Cart, Category, Product, ShoppingList } from '@commercetools/platform-sdk';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import { fetchCarts } from '../thunks/FetchCarts';
import {
  fetchCategories,
} from '../thunks/FetchCategories';
import { fetchProducts } from '../thunks/FetchProducts';
import { fetchShoppingLists } from '../thunks/FetchShoppingLists';

interface InitialState {
  language: string;
  country: string;
  currency: string;
  categories: Category[];
  products: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  shoppingLists: ShoppingList[];
  cart: Cart;
  carts: Cart[];
}
const initialState: InitialState = {
  language: '',
  country: '',
  currency: '',
  categories: [],
  products: [],
  status: 'idle',
  shoppingLists: [],
  cart: {} as Cart,
  carts: [] as Cart[],
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
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
    setShoppingLists: (state, action: PayloadAction<ShoppingList[]>) => {
      state.shoppingLists = action.payload;
    },
    setCart: (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
    },
    setCarts: (state, action: PayloadAction<Cart[]>) => {
      state.carts = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchShoppingLists.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.shoppingLists = action.payload;
      })
      .addCase(fetchCarts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.carts = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
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
  setCategories,
  setProducts,
  setLanguage,
  setCountry,
  setCurrency,
  setShoppingLists,
  setCart,
  setCarts,
} = commerceToolseSlice.actions;
export const selectCommerceTools = (state: RootState) => state.commercetools;
export default commerceToolseSlice.reducer;
