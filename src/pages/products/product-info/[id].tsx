import { GetStaticPaths, GetStaticProps } from 'next';
import { Product } from '@commercetools/platform-sdk';
import ProductInfo from '@/components/product-info/ProductInfo';
import React from 'react';
import { getProducts } from '@/commercetools/utilsCommercTools';

function ProductInfoDynamic({ product }: { product: Product }) {
  return (
    <ProductInfo product={product} />
  );
}

export default ProductInfoDynamic;

export const getStaticPaths: GetStaticPaths = async () => {
  const products = await getProducts() as Product[];

  const paths = products.map((el) => (
      {
        params: {
          id: el.id
        }
      }
  ));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id as string;
  const product = await getProducts(id) as Product;

    return {
      props: {
        product
      }
    };
};