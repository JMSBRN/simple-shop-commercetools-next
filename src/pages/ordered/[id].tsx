import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function OrderedPage({ params }: { params: ParsedUrlQuery }) {
    const { id } = params;

  return <div>OrderedPage
    <br />
     <br />
    {id as string}
  </div>;
}

export default OrderedPage;

export const getServerSideProps: GetServerSideProps = async ({ locale, params }) => ({
    props: {
        params,
      ...(await serverSideTranslations(locale || 'en', [
        'translation',
        'common',
      ])),
    },
  });
