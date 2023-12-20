import { ShoppingList } from '@commercetools/platform-sdk';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getShoppingLists } from '@/commercetools/utils/utilsShoppingList';

export const fetchShoppingLists = createAsyncThunk<ShoppingList[]>(
    'shoppingLists/fetchShoppingLists',
    async () => {
      try {
        const shoppingLists = await getShoppingLists() as ShoppingList[];

        return shoppingLists;
      } catch (error) {
        throw new Error(`Error fetching shoppingLists from commercetools: ${error}`);
      }
    }
  );