import { Category } from '@commercetools/platform-sdk';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCategories } from '@/commercetools/utils/utilsCommercTools';
import { isErrorResponse } from '@/commercetools/utils/utilsApp';

export const fetchCategories = createAsyncThunk<Category[]>(
    'categories/fetchCategories',
    async () => {
      try {
        const res = await getCategories();

        if(!isErrorResponse(res) && Array.isArray(res)) {
          return res;
        } else {
          return [] as Category[];
        }
        
      } catch (error) {
        throw new Error(`Error fetching categories from commercetools: ${error}`);
      }
    }
  );
