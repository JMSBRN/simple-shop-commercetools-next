import { Category, Product } from '@commercetools/platform-sdk';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { fetchCategories, fetchProducts } from '../thunks/FetchCategories';
import { RootState } from '@/store/store';

interface InitialState {
   language: string;
   country: string;
   categories: Category[];
   products: Product[];
   status: 'idle' | 'loading' | 'succeeded' | 'failed';
}
const initialState: InitialState = {
  language: '',
  country: '',
  categories: [],
  products: [],
  status: 'idle'
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
  }, extraReducers : (builder) => {
    builder
    .addCase(fetchCategories.pending, (state) => {
      state.status = 'loading';
    }).addCase(fetchCategories.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.categories = action.payload;
    }).addCase(fetchProducts.pending, (state) => {
      state.status = 'loading';
    }).addCase(fetchProducts.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.products = action.payload;
    });
  }
 
 });

export const { setCategories, setProducts, setLanguage, setCountry } = commerceToolseSlice.actions;
export const selectCommerceTools = (state: RootState) => state.commercetools;
export default commerceToolseSlice.reducer;