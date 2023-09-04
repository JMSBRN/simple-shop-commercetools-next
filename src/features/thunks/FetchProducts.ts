import { Product } from '@commercetools/platform-sdk';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts } from '@/commercetools/utils/utilsCommercTools';

export const fetchProducts = createAsyncThunk<Product[]>(
    'products/fetchProducts',
    async () => {
      try {
        const products = await getProducts() as Product[];

        return products;
      } catch (error) {
        throw new Error(`Error fetching products from commercetools: ${error}`);
      }
    }
  );
