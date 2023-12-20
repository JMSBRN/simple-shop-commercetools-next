import {
  Product,
  TaxCategory,
  TaxCategoryReference,
} from '@commercetools/platform-sdk';
import { PriceValue } from '../../components/product-card/interfacesProductCard';
import { apiRoot } from '@/commercetools/BuildClient';
import { getProducts } from '@/commercetools/utils/utilsCommercTools';

function formatValue(value: PriceValue): string {
  const amountInDollars = value.centAmount / Math.pow(10, value.fractionDigits);
  const formattedAmount = amountInDollars.toFixed(value.fractionDigits);

  // Adding commas to the formatted amount
  const parts = formattedAmount.split('.');

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return parts.join('.');
}

function getPriceValue(value: PriceValue): number {
  return value.centAmount / Math.pow(10, value.fractionDigits);
}

function setDynamicArray(items: number) {
  const arr = [];

  for (var i = 1; i <= items; i++) {
    arr.push(i);
  }
  return arr;
}

const setTotalPriceWithComma = (quantity: number, price: PriceValue) => {
  if (quantity === 1) {
    return formatValue(price);
  }
  return (quantity * getPriceValue(price)).toFixed(2);
};

export { formatValue, getPriceValue, setDynamicArray, setTotalPriceWithComma };

export const getTaxCategories = async (ID?: string) => {
  if (ID)
    return (await apiRoot.taxCategories().withId({ ID }).get().execute()).body;
  return (await apiRoot.taxCategories().get().execute()).body.results;
};
export const getTaxCategoryWithProductId = async (productId: string) => {
  const product = (await getProducts(productId)) as Product;
  const { id } = product.taxCategory as TaxCategoryReference;

  if (id) return (await getTaxCategories(id)) as TaxCategory;
};

export const getRateFromTaxCategoryWithProductId = async (
  productId: string,
  country: string
) => {
  const taxCategory = await getTaxCategoryWithProductId(productId) as TaxCategory;

  const { rates } = taxCategory;

  return rates
    .filter((el) => el.country === country)
    .map((el) => {
      return el;
    })
    .find((el) => el.name);
};
