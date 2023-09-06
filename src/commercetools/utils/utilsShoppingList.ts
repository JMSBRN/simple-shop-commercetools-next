import {
  LocalizedString,
  Product,
  ShoppingList,
} from '@commercetools/platform-sdk';
import { apiRoot } from '../BuildClient';
import { getPriceValue } from '@/components/product-card/utilsProductCard';
import { getProducts } from './utilsCommercTools';

export const getShoppingLists = async (ID?: string) => {
  if (ID) {
    return (await apiRoot.shoppingLists().withId({ ID }).get().execute()).body;
  }
  return (await apiRoot.shoppingLists().get().execute()).body.results;
};
export const deleteShoppingList = async (ID: string, version: number) => {
  const res = await apiRoot
    .shoppingLists()
    .withId({ ID })
    .delete({
      queryArgs: {
        version,
      },
    })
    .execute();
  const { body, statusCode } = res;

  return { body, statusCode };
};

export const createShoppingListWithProductId = async (
  name: LocalizedString,
  productId: string,
  quantity: number
) => {
  const res = await apiRoot
    .shoppingLists()
    .post({
      body: {
        name,
        lineItems: [
          {
            productId,
            quantity,
          },
        ],
      },
    })
    .execute();

  return res.body;
};

export const updateQuantityInShoppingList = async (
  shoppingListId: string,
  version: number,
  lineItemId: string,
  quantity: number
) => {
  const res = await apiRoot
    .shoppingLists()
    .withId({ ID: shoppingListId })
    .post({
      body: {
        version,
        actions: [
          {
            action: 'changeLineItemQuantity',
            lineItemId,
            quantity,
          },
        ],
      },
    })
    .execute();
  const { body, statusCode } = res;

  return { body, statusCode };
};

export const filterShoppingListsByProductId = (
  shoppingLists: ShoppingList[],
  productId: string
) => {
  return shoppingLists.filter((shoppingList) => {
    return shoppingList.lineItems.some(
      (lineItem) => lineItem.productId === productId
    );
  });
};

export const getImagesUrlsFromProduct = async (productId: string) => {
  const res = (await getProducts(productId)) as Product;
  const { current } = res.masterData;
  const { images } = current.masterVariant;

  if (images)
    return images.map((el) => {
      return el.url;
    });
};
export const getPricesFromProduct = async (productId: string) => {
  const res = (await getProducts(productId)) as Product;
  const { current } = res.masterData;
  const { prices } = current.masterVariant;

  if (prices)
    return prices.map((el) => {
      return el;
    });
};

export const getLineItemsFromSoppingLists = async (
  shoppingLists: ShoppingList[]
) => {
  const arr = shoppingLists.flatMap((list) => list.lineItems);

  return [...arr];
};

export const getTotalSumFromSoppingLists = async (
  shoppingLists: ShoppingList[],
  country: string
) => {
  const linItems = await getLineItemsFromSoppingLists(shoppingLists);

  const p = linItems.map(async (item) => {
    return {
      prices: await getPricesFromProduct(item.productId),
      quantity: item.quantity,
    };
  });

  const prices = (await Promise.all(p)).map((e) => {
    return {
      p: {
        value: e.prices
          ?.filter((e) => e.country === country)
          .map((p) => {
            return getPriceValue(p.value);
          })
          .flat()
          .reduce(
            (acc, currentValue) =>
              acc + (Array.isArray(currentValue) ? 0 : currentValue),
            0
          ),
        currencyCode: e.prices
          ?.filter((e) => e.country === country)
          .find((el) => el)?.value.currencyCode,
      },
      q: e.quantity,
    };
  });
  const currencyCode = prices.find(e => e.p.currencyCode)?.p.currencyCode;
  const totalPrice = prices.reduce((acc: number, item) => {
    if (typeof item.p.value === 'number' && item.q > 0) {
      return acc + item.p.value * item.q;
    }
    return acc;
  }, 0);

  return { totalPrice: totalPrice.toFixed(2), currencyCode };
};
