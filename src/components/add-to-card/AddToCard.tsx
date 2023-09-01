
import React, { useState } from 'react';
import { ShoppingList, ShoppingListUpdate } from '@commercetools/platform-sdk';
import { apiRoot } from '@/commercetools/BuildClient';

function AddToCard({ productId, quantity }: { productId: string, quantity: number }) {
  const [shopingList, setShopingList] = useState<ShoppingList>({} as ShoppingList);
  const [lineItemId, setLineItemId] = useState<string>('');

  const handleCreaateCard = async () => {

    if(shopingList.id) {
     const { version, lineItems } = shopingList;

     lineItems.map( el => { if (el.id) setLineItemId(el.id); });
      const shopinListUpdate: ShoppingListUpdate = {
        version,
        actions: [{
          action: 'changeLineItemQuantity',
          lineItemId,
          quantity
        }]
      };

      apiRoot.shoppingLists().withId({ ID: shopingList.id }).post({
        body: shopinListUpdate
      }).execute().then( data => {
        console.log(data);
      });

    }

    const res = await apiRoot.shoppingLists().post({
     body: {
      name: {
        'en': 'my shoping list'
      }
     }
    }).execute();

    if(shopingList) {
      const { id, version } = res.body;

      if(quantity) {
        setShopingList(res.body);
        const shopinListUpdate: ShoppingListUpdate = {
           version,
           actions: [{
             action: 'addLineItem',
             productId,
             quantity
           }]
         };
   
         apiRoot.shoppingLists().withId({ ID: id }).post({
           body: shopinListUpdate
         }).execute().then( data => {
           console.log(data);
         });
      }
    }
     
  };

  return (
    <div>
      <div className="counter">count</div>
      <button type="button" onClick={() => handleCreaateCard()}>
        add to cart
      </button>
    </div>
  );
}

export default AddToCard;
