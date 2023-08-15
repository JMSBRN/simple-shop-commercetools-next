import { GetStaticPaths, GetStaticProps } from 'next';
import { Product } from '@commercetools/platform-sdk';
import React from 'react';
import { apiRoot } from '@/commercetools/BuildClient';
import { useRouter } from 'next/router';

function Products({ products }: { products: Product[] }) {
  const { query } = useRouter();
  const { id } = query;

  return <div>{
     products.filter((el) => el.masterData.current.categories[0].id === id ).map((el) => (
      <div key={el.id}>
        <div>{el.key}</div>
      </div>
     ))
    }</div>;
}

export default Products;

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await apiRoot.products().get().execute();
  const { results } = res.body;
  const paths = results.map((el) => (
      {
        params: {
          id: el.masterData.current.categories[0].id
        }
      }
  ));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async () => {
  const res = await apiRoot.products().get().execute();
  const { results } = res.body;

    return {
      props: {
        products: results
      }
    };
};