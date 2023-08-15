import Categories from '@/components/categories/Categories';
import Footer from '@/components/footer/Footer';
import Head from 'next/head';
import Header from '@/components/header/Header';
import styles from '../styles/Home.module.scss';

export default function Home() {

  return (
    <>
      <Head>
        <title>Simple Shop</title>
        <meta name="description" content="simple shop commercetools api lerning project" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Header />
        <Categories />
        <Footer />
      </main>
    </>
  );
}
