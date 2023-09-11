import { Cart } from '@commercetools/platform-sdk';
import { apiRoot } from '../BuildClient';
import { getPriceValue } from '@/components/product-card/utilsProductCard';
import { getPricesFromProduct } from './utilsShoppingList';

export const getCarts = async (ID?: string) => {
  if (ID) {
    return (await apiRoot.carts().withId({ ID }).get().execute()).body;
  }
  return (await apiRoot.carts().get().execute()).body.results;
};
export const deleteCart = async (ID: string, version: number ) => {
  if (ID) {
    return (await apiRoot.carts().withId({ ID }).delete({
      queryArgs: {
        version
      }
    }).execute()).body;
  }
};

export const removeLineItemfromCart = async (ID: string, version: number, lineItemId: string) => {
   const res = await apiRoot.carts().withId({ ID }).post({
    body: {
      version,
      actions: [{
        action: 'removeLineItem',
        lineItemId,
      }]
    }
   }).execute();

   return res;
}; 

export const createCartWithProductId = async (
  currency: string,
  country: string,
  productId?: string,
  quantity?: number
) => {
  if (currency) {
    const res = await apiRoot
      .carts()
      .post({
        body: {
          currency,
          country,
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
  }
};
export const addShoopingListToCart = async (
  ID: string,
  version: number,
  shopingListId: string
) => {
  if (ID) {
    const res = await apiRoot
      .carts()
      .withId({ ID })
      .post({
        body: {
          version,
          actions: [
            {
              action: 'addShoppingList',
              shoppingList: {
                id: shopingListId,
                typeId: 'shopping-list',
              },
            },
          ],
        },
      })
      .execute();

    return res.body;
  }
};
export const addLineItemToCart = async (
  ID: string,
  version: number,
  productId: string,
  quantity: number,
  variantId: number
) => {
  if (ID) {
    const res = await apiRoot
      .carts()
      .withId({ ID })
      .post({
        body: {
          version,
          actions: [
            {
              action: 'addLineItem',
              productId,
              quantity,
              variantId,
            },
          ],
        },
      })
      .execute();

    return res.body;
  }
};
export const updateCartLineitemQuantity = async (
  ID: string,
  version: number,
  lineItemId: string,
  quantity: number
) => {
  const res = await apiRoot
    .carts()
    .withId({ ID })
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

  return res.body;
};

export const getLineItemsFromCarts = async (
  carts: Cart[]
) => {
  const arr = carts.flatMap((cart) => cart.lineItems);

  return [...arr];
};

export const getTotalSumFromCarts = async (
  carts: Cart[],
  country: string
) => {
  const lineItems = await getLineItemsFromCarts(carts);

  const p = lineItems.map(async (item) => {
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
export const getTotalSumFromCart = async (
  cart: Cart,
  country: string
) => {
  const { lineItems } = cart;

  const p = lineItems.map(async (item) => {
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

