import React, { useEffect, useState } from 'react';
import { Cart } from '@commercetools/platform-sdk';
import { GetServerSideProps } from 'next';
import { UserData } from '@/interfaces';
import { filterObjectAndReturnValue } from '@/commercetools/utils/utilsCommercTools';
import { getDecryptedDataFromCookie } from '@/commercetools/utils/secureCookiesUtils';
import { getMyCarts } from '@/commercetools/utils/utilsMe';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

function DashBoard() {
  const { locale } = useRouter();
  const [myCarts, setMyCarts] = useState<Cart[]>([]);

  useEffect(() => {
    const fn = async () => {
      const userDataFromLocal = JSON.parse(
        getDecryptedDataFromCookie('userData')!
      ) as UserData;

      if (userDataFromLocal?.email) {
        const { email, password } = userDataFromLocal;
        const resMycarts = (await getMyCarts(email, password!)) as Cart[];

        if (resMycarts.length) {
          setMyCarts(resMycarts);
        }
      }
    };

    fn();
  }, []);

  return (
    <div>
      <div className="carts">
        {myCarts.map((c) => (
          <div key={c.id}>
            -------
            {c.id}
            {c.lineItems.map((l) => (
              <div key={l.id}>
                {filterObjectAndReturnValue(l.name, locale as string)}
              </div>
            ))}
            {c.id}
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
