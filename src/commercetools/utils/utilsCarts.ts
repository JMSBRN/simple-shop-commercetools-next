import {
  Cart,
  TaxedPrice,
  TypedMoney,
  _BaseAddress,
} from '@commercetools/platform-sdk';
import { createCreditCardPayment, deleteAllPaymentsFromPaymentInfo } from './utilsPayment';
import { apiRoot } from '../BuildClient';
import { getCurrencySymbol } from './utilsCommercTools';
import { getPriceValue } from '@/commercetools/utils/utilsProductCard';
import { getPricesFromProduct } from './utilsShoppingList';
import { getShippingMethodsWithCountry } from './utilsShippingMethods';
import { setCurrency } from '@/commercetools/utils/utilsApp';

export const getCarts = async (ID?: string) => {
  if (ID) {
    return (await apiRoot.carts().withId({ ID }).get().execute()).body;
  }
  return (await apiRoot.carts().get().execute()).body.results;
};
export const deleteCart = async (ID: string) => {
  if (ID) {
    const { version, paymentInfo } = (await getCarts(ID)) as Cart;

    const res = await apiRoot
      .carts()
      .withId({ ID })
      .delete({
        queryArgs: {
          version,
        },
      })
      .execute();

      if (res.statusCode === 200) {
        if(paymentInfo) {
          return (await deleteAllPaymentsFromPaymentInfo(paymentInfo));
        }
        return false;
      }
  }

  return false;
};

export const removeLineItemfromCart = async (
  ID: string,
  version: number,
  lineItemId: string
) => {
  const res = await apiRoot
    .carts()
    .withId({ ID })
    .post({
      body: {
        version,
        actions: [
          {
            action: 'removeLineItem',
            lineItemId,
          },
        ],
      },
    })
    .execute();

  return res;
};

export const createCartWithProductId = async (
  country: string,
  productId: string,
  variantId: number,
  quantity?: number,
  anonymousId?: string,
  customerId?: string
) => {
  if (country) {
    const currency = setCurrency(country);
    const shippingMethodId = (
      await getShippingMethodsWithCountry(country)
    ).find((el) => el.id)?.id;

    if (shippingMethodId) {
      const resCreateCart = await apiRoot
        .carts()
        .post({
          body: {
            currency,
            country,
            anonymousId,
            customerId,
            lineItems: [
              {
                productId,
                quantity,
                variantId,
              },
            ],
            shippingMethod: {
              typeId: 'shipping-method',
              id: shippingMethodId,
            },
            shippingAddress: {
              country,
            },
          },
        })
        .execute();

        if(resCreateCart.statusCode === 201) {
          const resCreatePayment = await createCreditCardPayment(currency, customerId);

          if(resCreatePayment.statusCode === 201) {
            const createdCart = resCreateCart.body;
            const createdPayment = resCreatePayment.body;
            const res = await addPaymentToCart(createdCart.id, createdPayment.id );

            return res;
          }
        }
    }
  }
};
export const addShippingAddresToCart = async (
  ID: string,
  country: string,
  address?: _BaseAddress
) => {
  const res = (await getCarts(ID)) as Cart;
  const { version } = res;

  return await apiRoot
    .carts()
    .withId({ ID })
    .post({
      body: {
        version,
        actions: [
          {
            action: 'setShippingAddress',
            address: {
              ...address,
              country,
            },
          },
        ],
      },
    })
    .execute();
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
  return await apiRoot
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
};

export const getLineItemsFromCarts = async (carts: Cart[]) => {
  const arr = carts.flatMap((cart) => cart.lineItems);

  return [...arr];
};

export const getTotalSumFromCarts = async (carts: Cart[], country: string) => {
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
  const currencyCode = prices.find((e) => e.p.currencyCode)?.p.currencyCode;
  const totalPrice = prices.reduce((acc: number, item) => {
    if (typeof item.p.value === 'number' && item.q > 0) {
      return acc + item.p.value * item.q;
    }
    return acc;
  }, 0);

  return { totalPrice: totalPrice.toFixed(2), currencyCode };
};
export const getTotalSumFromCart = async (cart: Cart, country: string) => {
  const { lineItems } = cart;
  const p = lineItems.map(async (item) => {
    return {
      id: item.productId,
      prices: await getPricesFromProduct(item.productId),
      quantity: item.quantity,
    };
  });

  const prices = (await Promise.all(p)).map((e) => {
    return {
      productId: e.id,
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
  const productsId = prices.map((el) => el.productId);
  const currencyCode = prices.find((e) => e.p.currencyCode)?.p.currencyCode;
  const totalPrice = prices.reduce((acc: number, item) => {
    if (typeof item.p.value === 'number' && item.q > 0) {
      return acc + item.p.value * item.q;
    }
    return acc;
  }, 0);

  return { productsId, totalPrice: totalPrice.toFixed(2), currencyCode };
};

export const getOriginalSubTotal = (
  taxedPrice: TaxedPrice,
  taxedShippingPrice: TaxedPrice
) => {
  const originalSubTotal =
    taxedPrice.totalNet.centAmount +
    taxedPrice.totalTax?.centAmount! -
    taxedShippingPrice.totalGross.centAmount;

  return originalSubTotal;
};

export const getMoneyValueFromCartField = (value: TypedMoney) => {
  const { centAmount, currencyCode, fractionDigits } = value;

  const amount = centAmount / Math.pow(10, fractionDigits);
  const formattedAmount = amount.toFixed(fractionDigits);

  // Adding commas to the formatted amount
  const parts = formattedAmount.split('.');

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return `${parts.join('.')} ${getCurrencySymbol(
    currencyCode,
    value.currencyCode
  )}`;
};

export const setShippingMethodToCart = async (
  cartId: string,
  methodId: string
) => {
  const cart = (await getCarts(cartId)) as Cart;
  const { version } = cart;

  return await apiRoot
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version,
        actions: [
          {
            action: 'setShippingMethod',
            shippingMethod: {
              typeId: 'shipping-method',
              id: methodId,
            },
          },
        ],
      },
    })
    .execute();
};

export const addPaymentToCart = async (cartId: string, payMentId: string) => {
  const { version } = (await getCarts(cartId)) as Cart;

  return await apiRoot
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version,
        actions: [
          {
            action: 'addPayment',
            payment: {
              typeId: 'payment',
              id: payMentId,
            },
          },
        ],
      },
    })
    .execute();
};

export const removePaymentFromCart = async (
  cartId: string,
  payMentId: string
) => {
  const { version } = (await getCarts(cartId)) as Cart;

  return await apiRoot
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version,
        actions: [
          {
            action: 'removePayment',
            payment: {
              typeId: 'payment',
              id: payMentId,
            },
          },
        ],
      },
    })
    .execute();
};
