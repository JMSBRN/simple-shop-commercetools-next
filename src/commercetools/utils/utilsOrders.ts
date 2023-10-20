import { ClientResponse, Order, _BaseAddress } from '@commercetools/platform-sdk';
import { apiRoot } from '../BuildClient';

export const getOrders = async (ID?: string) => {
  if (ID) return await apiRoot.orders().withId({ ID }).get().execute();
  return (await apiRoot.orders().get().execute()).body.results;
};

export const deleteOrder = async (ID: string, version: number) => {
  return await apiRoot
    .orders()
    .withId({ ID })
    .delete({
      queryArgs: {
        version,
      },
    })
    .execute();
};
export const addBillingAdressToOrder = async (
  ID: string,
  country: string,
  address?: _BaseAddress
) => {
  const { body } = await getOrders(ID) as ClientResponse<Order>;
  const {  version } = body;

  return (await apiRoot
    .orders()
    .withId({ ID })
    .post({
      body: {
        version,
        actions: [
          {
            action: 'setBillingAddress',
            address : {
              ...address,
              country
            },
          },
        ],
      },
    })
    .execute());
};

export const createOrder = async (
  cartId: string,
  version: number,
  cartState: string
) => {
  if (cartId) {
    if (cartState === 'Active') {
       return (await apiRoot
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
        .execute());
    }
  }
};
