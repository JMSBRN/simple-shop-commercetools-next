import { Cart, Category, Order, Product, ShoppingList } from '@commercetools/platform-sdk';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import { fetchCarts } from '../thunks/FetchCarts';
import {
  fetchCategories,
} from '../thunks/FetchCategories';
import { fetchOrders } from '../thunks/FetchOrders';
import { fetchProducts } from '../thunks/FetchProducts';
import { fetchShoppingLists } from '../thunks/FetchShoppingLists';

interface InitialState {
  language: string;
  country: string;
  categories: Category[];
  products: Product[];
  orders: Order[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  shoppingLists: ShoppingList[];
  cart: Cart;
  carts: Cart[];
  userName: string;
}
const initialState: InitialState = {
  language: '',
  country: '',
  categories: [],
  products: [],
  orders: [] as Order[],
  status: 'idle',
  shoppingLists: [],
  cart: {} as Cart,
  carts: [] as Cart[],
  userName: ''
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
    setShoppingLists: (state, action: PayloadAction<ShoppingList[]>) => {
      state.shoppingLists = action.payload;
    },
    setCarts: (state, action: PayloadAction<Cart[]>) => {
      state.carts = action.payload;
    },
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
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
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
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
  setOrders,
  setLanguage,
  setCountry,
  setShoppingLists,
  setCarts,
  setUserName
} = commerceToolseSlice.actions;
export const selectCommerceTools = (state: RootState) => state.commercetools;
export default commerceToolseSlice.reducer;
