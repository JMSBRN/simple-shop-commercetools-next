
import { Cart } from '@commercetools/platform-sdk';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCarts } from '@/commercetools/utils/utilsCarts';

export const fetchCarts = createAsyncThunk<Cart[]>(
    'carts/fetchCarts',
    async () => {
      try {
        const carts = await getCarts() as Cart[];

        return carts;
      } catch (error) {
        throw new Error(`Error fetching carts from commercetools: ${error}`);
      }
    }
  );