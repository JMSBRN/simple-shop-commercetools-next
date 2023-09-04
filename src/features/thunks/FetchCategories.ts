import { Category } from '@commercetools/platform-sdk';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCategories } from '@/commercetools/utils/utilsCommercTools';

export const fetchCategories = createAsyncThunk<Category[]>(
    'categories/fetchCategories',
    async () => {
      try {
        const categories = await getCategories() as Category[];

        return categories;
      } catch (error) {
        throw new Error(`Error fetching categories from commercetools: ${error}`);
      }
    }
  );
