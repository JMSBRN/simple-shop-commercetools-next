import { CredentialsForMyApiCall } from '@/interfaces';
import { Order } from '@commercetools/platform-sdk';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getMyOrders } from '@/commercetools/utils/utilsMe';
import { getOrders } from '@/commercetools/utils/utilsOrders';

export const fetchOrders = createAsyncThunk<
  Order[],
  CredentialsForMyApiCall | undefined
>('orders/fetchOrders', async (args) => {
  const { email, password } = args || {};

  try {
    if (email && password) {
      const res = await getMyOrders(email, password);

      return res as Order[];
    } else {
      const res = await getOrders();

      return res as Order[];
    }
  } catch (error) {
    throw new Error(`Error fetching carts from commercetools: ${error}`);
  }
});
