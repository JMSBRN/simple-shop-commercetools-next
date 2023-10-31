import { Cart, ErrorResponse } from '@commercetools/platform-sdk';
import { CredentialsForMyApiCall } from '@/interfaces';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCarts } from '@/commercetools/utils/utilsCarts';
import { getMyCarts } from '@/commercetools/utils/utilsMe';
import { isErrorResponse } from '@/commercetools/utils/utilsApp';

export const fetchCarts = createAsyncThunk<Cart[], CredentialsForMyApiCall | undefined>(
  'carts/fetchCarts',
  async (args) => {
    const { email, password } = args || {};
    const credentialsProvided = email && password;

    try {
      let res: Cart | Cart[] | ErrorResponse;

      if (credentialsProvided) {
        res = await getMyCarts(email, password);
      } else {
        res = await getCarts();
      }

      if (!isErrorResponse(res) && Array.isArray(res)) {
        return res;
      } else {
        throw new Error('Error fetching carts from commercetools');
      }
    } catch (error) {
      throw new Error(`Error fetching carts from commercetools: ${(error as Error).message}`);
    }
  }
);
