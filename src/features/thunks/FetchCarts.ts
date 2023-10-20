import { Cart } from '@commercetools/platform-sdk';
import { CredentialsForMyApiCall } from '@/interfaces';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCarts } from '@/commercetools/utils/utilsCarts';
import { getMyCarts } from '@/commercetools/utils/utilsMe';

export const fetchCarts = createAsyncThunk<Cart[], CredentialsForMyApiCall | undefined>(
  'carts/fetchCarts',
  async (args) => {
    const { email, password } = args || {};

    try {
      if (email && password) {
        const res = await getMyCarts(email, password);

        return res as Cart[];
      } else {
        const res = await getCarts();

        return res as Cart[];
      }
    } catch (error) {
      throw new Error(`Error fetching carts from commercetools: ${error}`);
    }
  }
);

