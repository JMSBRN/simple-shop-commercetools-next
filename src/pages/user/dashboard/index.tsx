import { Cart, Order } from '@commercetools/platform-sdk';
import React, { useEffect, useState } from 'react';
import { getMyCarts, getMyOrders } from '@/commercetools/utils/utilsMe';
import { GetServerSideProps } from 'next';
import { UserData } from '@/interfaces';
import { filterObjectAndReturnValue } from '@/commercetools/utils/utilsCommercTools';
import { getDecryptedDataFromCookie } from '@/commercetools/utils/secureCookiesUtils';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

function DashBoard() {
  const { locale } = useRouter();
  const [myCarts, setMyCarts] = useState<Cart[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fn = async () => {
      const userDataFromLocal = JSON.parse(
        getDecryptedDataFromCookie('userData')!
      ) as UserData;

      if (userDataFromLocal?.email) {
        const { email, password } = userDataFromLocal;
        const resMycarts = (await getMyCarts(email, password!)) as Cart[];
        const resMyOrders = (await getMyOrders(email, password!)) as Order[];

        if (resMycarts.length) {
          setMyCarts(resMycarts);
        }
        if (resMyOrders.length) {
          setMyOrders(resMyOrders);
        }
      }
    };

    fn();
  }, []);

  return (
    <div style={{ width: '800px', display: 'flex', justifyContent: 'space-between' }}>
      <div className="carts">
        CARTS
        {myCarts.map((c) => (
          <div key={c.id}>
            -------
            {c.id}
            <br />
            <br />
            {c.cartState}
            <br />
            <br />
            {c.lineItems.map((l) => (
              <div key={l.id}>
                {filterObjectAndReturnValue(l.name, locale as string)}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="orders">
        ORDERS
        {myOrders.map((o) => (
          <div key={o.id}>
            -------
            {o.id}
            <br />
            <br />
            {o.orderState}
            <br />
            <br />
            {o.lineItems.map((l) => (
              <div key={l.id}>
                {filterObjectAndReturnValue(l.name, locale as string)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashBoard;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en-GB', [
        'translation',
        'common',
      ])),
    },
  };
};
