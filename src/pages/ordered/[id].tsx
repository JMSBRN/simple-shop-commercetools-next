import { GetServerSideProps } from 'next';
import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function Ordered() {
  return <div>Ordered card page in develop mode </div>;
}

export default Ordered;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'en', ['translation', 'common'])),
  },
});
