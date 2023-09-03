import React, { useState } from 'react';
import { ShoppingList } from '@commercetools/platform-sdk';
import { apiRoot } from '@/commercetools/BuildClient';
import { filterObjectAndReturnValue } from '@/commercetools/utils/utilsCommercTools';
import styles from './WelcomePage.module.scss';

function WelcomePage() {
  const [list, setList] = useState<ShoppingList[]>([]);

  const handleClick = async () => {
    const res = await apiRoot.shoppingLists().get().execute();

    if (res) setList(res.body.results);
  };

  const handleDeleteShopingList = async (ID: string, version: number) => {
    const res = await apiRoot
      .shoppingLists()
      .withId({ ID })
      .delete({
        queryArgs: {
          version,
        },
      })
      .execute();

    console.log(res.statusCode);
    handleClick();
  };

  return (
    <div className={styles.welcomePageContainer}>
      <button onClick={handleClick}>Click me</button>
      <div>
        {list.map((el) => (
          <div
            style={{ margin: '10px 0' }}
            key={el.id}
            
          >
            <div>shopping list name : {filterObjectAndReturnValue(el.name, 'en')}</div>
            <div>created by  ID: {el.createdBy?.clientId}</div>
            <div className="">version {el.version}</div>
            <div
             style={{ margin: '10px 0' }}
             onClick={() => handleDeleteShopingList(el.id, el.version)}
            >
            shopping list id :{el.id}</div>
            <div className="">shopping list key: { el.key || 'no exist' }</div>
            <div className="">{el.lineItems.map(el => (
              <div key={el.id}>
                <div className="">lineItem name: {filterObjectAndReturnValue(el.name, 'en')}</div>
                <div className="">lineItem id: {el.id}</div>
                <div className="">product id: {el.productId}</div>
                <div className="">quantity: {el.quantity}</div>
              </div>
            ))}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WelcomePage;
