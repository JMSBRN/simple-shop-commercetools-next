import { Cart, _BaseAddress } from '@commercetools/platform-sdk';
import { addShippingAddresToCart, getCarts } from './utilsCarts';
import { apiRoot } from '../BuildClient';

export const getOrders = async (ID?: string) => {
  if (ID) return (await apiRoot.orders().withId({ ID }).get().execute()).body;
  return (await apiRoot.orders().get().execute()).body.results;
};

export const createOrderWithShippingAddress = async (
  cartId: string,

  country: string,
  address?: _BaseAddress
) => {
  const { statusCode } = await addShippingAddresToCart(
    cartId,
    country,
    address
  );
  
  if (statusCode === 200) {
    const { id, version } = await getCarts(cartId) as Cart;

    return await apiRoot
      .orders()
      .post({
        body: {
          version,
          orderState: 'Open',
          cart: {
            typeId: 'cart',
            id,
          },
        },
      })
      .execute();
  }
};
