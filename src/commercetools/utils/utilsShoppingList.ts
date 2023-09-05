import { LocalizedString, Product, ShoppingList } from '@commercetools/platform-sdk';
import { apiRoot } from '../BuildClient';
import { getProducts } from './utilsCommercTools';

export const getShoppingLists = async (ID?: string) => {
  if (ID) {
    return (await apiRoot.shoppingLists().withId({ ID }).get().execute()).body;
  }
  return (await apiRoot.shoppingLists().get().execute()).body.results;
};
export const deleteShoppingList = async (ID: string, version: number) => {
   const res =  await apiRoot.shoppingLists().withId({ ID }).delete({
      queryArgs: {
        version
      }
    }).execute();
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
   const res = await getProducts(productId) as Product;
     const { current } = res.masterData;
     const { images } = current.masterVariant;

   if(images) return images.map((el) => {
     return el.url;
});
};
export const getPricesUrlsFromProduct = async (productId: string) => {
   const res = await getProducts(productId) as Product;
     const { current } = res.masterData;
     const { prices } = current.masterVariant;

   if(prices) return prices.map((el) => {
     return el;
});
};

