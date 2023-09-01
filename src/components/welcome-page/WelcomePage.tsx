import React, { useState } from 'react';
import { ShoppingList } from '@commercetools/platform-sdk';
import { apiRoot } from '@/commercetools/BuildClient';
import { filterObjectAndReturnValue } from '@/commercetools/utilsCommercTools';
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
            onClick={() => handleDeleteShopingList(el.id, el.version)}
          >
            {filterObjectAndReturnValue(el.name, 'en')}
            <div className="">{el.id}</div>
            <div className="">{el.lineItems.map(el => (
              <div key={el.id}>{filterObjectAndReturnValue(el.name, 'en')}</div>
            ))}</div>
            <div className="">{JSON.stringify(el.createdBy)}</div>
            <div className="">version {el.version}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WelcomePage;
