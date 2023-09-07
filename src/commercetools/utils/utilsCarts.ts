import { apiRoot } from '../BuildClient';

export const createCart = async (currency: string) => {
  if (currency) {
    const res = await apiRoot
      .carts()
      .post({
        body: {
          currency,
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
