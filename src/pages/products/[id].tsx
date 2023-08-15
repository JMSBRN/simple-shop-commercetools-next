import { GetStaticPaths, GetStaticProps } from 'next';
import { Product } from '@commercetools/platform-sdk';
import ProductCard from '@/components/product-card/ProductCard';
import React from 'react';
import { getProducts } from '@/commercetools/utilsCommercTools';
import styles from '../../styles/Products.module.scss';
import { useRouter } from 'next/router';

function Products({ products }: { products: Product[] }) {
  const { query } = useRouter();
  const { id } = query;
  const { productsContainer, productsStyle } = styles;

  return (
    <div className={productsContainer}>
       <div className={productsStyle}>{
     products.filter((el) => el.masterData.current.categories[0].id === id ).map((el) => (
      <div key={el.id}>
        <ProductCard product={el}/>
      </div>
     ))
    }</div>
    </div>
  );
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