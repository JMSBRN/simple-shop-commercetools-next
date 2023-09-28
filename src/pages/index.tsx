import { GetServerSideProps } from 'next/types';
import Head from 'next/head';
import WelcomePage from '@/components/welcome-page/WelcomePage';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { toggleServerSideLaguage } from '@/commercetools/utils/utilsApp';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    const currentLanguage = JSON.parse(window.localStorage.getItem('lang') || '"en"');
    
    return toggleServerSideLaguage(router, currentLanguage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <>
      <Head>
        <title>Simple Shop</title>
        <meta name="description" content="simple shop commercetools api lerning project" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <WelcomePage />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'en', ['translation', 'common'])),
  },
});
