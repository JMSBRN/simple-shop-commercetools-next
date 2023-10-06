import { Cart } from '@commercetools/platform-sdk';
import { GetServerSideProps } from 'next';
import React from 'react';
import { filterObjectAndReturnValue } from '@/commercetools/utils/utilsCommercTools';
import { getMyCarts } from '@/commercetools/utils/utilsMe';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

function DashBoard({ myCarts }: { myCarts: Cart[] }) {
  const { locale } = useRouter();

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
  const myCarts = await getMyCarts('q@q', '1');

  return {
    props: {
      myCarts,
      ...(await serverSideTranslations(locale || 'en-GB', [
        'translation',
        'common',
      ])),
    },
  };
};
