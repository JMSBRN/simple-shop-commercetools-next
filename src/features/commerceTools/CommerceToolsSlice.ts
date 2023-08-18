import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Category } from '@commercetools/platform-sdk';
import { RootState } from '@/store/store';

interface InitialState {
   language: string;
   categories: Category[];
}
const initialState: InitialState = {
  language: 'en-US',
  categories: []
};
const commerceToolseSlice = createSlice({
  name: 'commercetools',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
      console.log(state.language);
    },
  }
 
 });

export const { setCategories, setLanguage } = commerceToolseSlice.actions;
export const selectCommerceTools = (state: RootState) => state.commercetools;
export default commerceToolseSlice.reducer;