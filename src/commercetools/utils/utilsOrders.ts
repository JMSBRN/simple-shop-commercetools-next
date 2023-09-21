import { apiRoot } from '../BuildClient';

export const getOrders = async (ID?: string) => {
  if (ID) return (await apiRoot.orders().withId({ ID }).get().execute());
  return (await apiRoot.orders().get().execute());
};
export const deleteOrder = async (ID: string, version: number) => {
  return (await apiRoot.orders().withId({ ID }).delete({
    queryArgs: {
      version
    }
  }).execute());
};

export const createOrder = async (cartId: string, version: number, cartState: string) => {
  if (cartId) {

    if (cartState === 'Active') {
      return await apiRoot
        .orders()
        .post({
          body: {
            version,
            orderState: 'Open',
            cart: {
              typeId: 'cart',
              id: cartId,
            },
          },
        })
        .execute();
    }
  }
};
