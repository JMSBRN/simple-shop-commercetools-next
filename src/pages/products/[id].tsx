import { GetStaticPaths, GetStaticProps } from 'next';
import { Product } from '@commercetools/platform-sdk';
import React from 'react';
import { getProducts } from '@/commercetools/utilsCommercTools';
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
  const products = await getProducts();

  const paths = products.map((el) => (
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
  const products = await getProducts();

    return {
      props: {
        products
      }
    };
};