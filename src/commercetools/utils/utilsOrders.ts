import { Cart } from '@commercetools/platform-sdk';
import { apiRoot } from '../BuildClient';
import { getCarts } from './utilsCarts';

export const getOrders = async (ID?: string) => {
  if (ID) return (await apiRoot.orders().withId({ ID }).get().execute()).body;
  return (await apiRoot.orders().get().execute()).body.results;
};

export const createOrder = async (
  cartId: string,
) => {
 
    if (cartId) {
      const { id, version } = await getCarts(cartId) as Cart;
  
      return ( await apiRoot
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
        .execute());
    }
};
