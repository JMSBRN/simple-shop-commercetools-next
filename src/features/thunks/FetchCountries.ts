import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCountries } from '@/commercetools/utils/utilsCommercTools';
import { isErrorResponse } from '@/commercetools/utils/utilsApp';

export const fetchCountries = createAsyncThunk(
  'countries/fetchCountries',
  async () => {
    try {
      const res = await getCountries();

      if (!isErrorResponse(res) && Array.isArray(res)) {
        return res;
      } else {
        throw new Error('Error fetching countries from commercetools');
      }
    } catch (error) {
      throw new Error(
        `Error fetching countries from commercetools: ${
          (error as Error).message
        }`
      );
    }
  }
);
