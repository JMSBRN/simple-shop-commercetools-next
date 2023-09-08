import { apiRoot } from '../BuildClient';

export const getCarts = async (ID?:string) => {
  if(ID) {
    return (await apiRoot.carts().withId({ ID }).get().execute()).body;
  }
  return (await apiRoot.carts().get().execute()).body.results;

};

export const createCart = async (currency: string, country: string) => {
  if (currency) {
    const res = await apiRoot
      .carts()
      .post({
        body: {
          currency,
          country
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
export const updateCartLineitemQuantity =async (
  ID:string,
  version: number,
  lineItemId:string,
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
              quantity
             
            },
          ],
        },
      })
      .execute();

    return res.body;
};

