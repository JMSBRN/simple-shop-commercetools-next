import { Category } from '@commercetools/platform-sdk';
import { createAsyncThunk } from '@reduxjs/toolkit/dist/createAsyncThunk';
import { getCategories } from '@/commercetools/utilsCommercTools';

export const fetchCategories = createAsyncThunk<Category[]>(
    'categories/fetchItems',
    async () => {
      try {
        const categories: Category[] = await getCategories() as Category[];

        return categories;
      } catch (error) {
        throw new Error(`Error fetching categories from commercetools: ${error}`);
      }
    }
  );