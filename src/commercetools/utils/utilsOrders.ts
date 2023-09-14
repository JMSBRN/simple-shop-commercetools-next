import { _BaseAddress } from '@commercetools/platform-sdk';
import { addShippingAddresToCart } from './utilsCarts';
import { apiRoot } from '../BuildClient';

export const getOrders = async (ID?: string) => {
  if (ID) return (await apiRoot.orders().withId({ ID }).get().execute()).body;
  return (await apiRoot.orders().get().execute()).body.results;
};

export const createOrderWithShippingAddress = async (
  cartId: string,
  cartVersion: number,
  address: _BaseAddress
) => {
  const { statusCode } = await addShippingAddresToCart(
    cartId,
    cartVersion,
    address
  );
  
  if (statusCode === 200) {
    return await apiRoot
      .orders()
      .post({
        body: {
          version: cartVersion,
          orderState: 'Open',
          cart: {
            typeId: 'cart',
            id: cartId,
          },
        },
      })
      .execute();
  }
};
