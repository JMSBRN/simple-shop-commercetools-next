import Head from 'next/head';
import { apiRoot } from '@/commercetools/BuildClient';
import styles from '@/styles/Home.module.scss';
import { useEffect } from 'react';

export default function Home() {

  async function fethApi() {
    const res = await apiRoot.get().execute();

    console.log(res);
  }
  useEffect(() => {
    fethApi();
  }, []);
  
  return (
    <>
      <Head>
        <title>Simple Shop</title>
        <meta name="description" content="simple shop commercetools api lerning project" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        start
      </main>
    </>
  );
}
