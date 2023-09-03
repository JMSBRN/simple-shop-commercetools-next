import { Category, Product } from '@commercetools/platform-sdk';
import { getCategories, getProducts } from '@/commercetools/utils/utilsCommercTools';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCategories = createAsyncThunk<Category[]>(
    'categories/fetchCategories',
    async () => {
      try {
        const categories: Category[] = await getCategories() as Category[];

        return categories;
      } catch (error) {
        throw new Error(`Error fetching categories from commercetools: ${error}`);
      }
    }
  );
export const fetchProducts = createAsyncThunk<Product[]>(
    'categories/fetchProducts',
    async () => {
      try {
        const products: Product[] = await getProducts() as Product[];

        return products;
      } catch (error) {
        throw new Error(`Error fetching products from commercetools: ${error}`);
      }
    }
  );