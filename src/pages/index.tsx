import Categories from '@/components/categories/Categories';
import Footer from '@/components/footer/Footer';
import { GetServerSideProps } from 'next/types';
import Head from 'next/head';
import Header from '@/components/header/Header';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '../styles/Home.module.scss';
import { useTranslation } from 'next-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>Simple Shop</title>
        <meta name="description" content="simple shop commercetools api lerning project" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className="h2">{t('title')}</div>
        <Header />
        <Categories />
        <Footer />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'en', ['translation', 'common'])),
  },
});
