import { GetServerSideProps } from 'next';
import { Product } from '@commercetools/platform-sdk';
import ProductInfo from '@/components/product-info/ProductInfo';
import React from 'react';
import { getProducts } from '@/commercetools/utils/utilsCommercTools';

function ProductInfoDynamic({ product }: { product: Product }) {
  return (
    <>
      <ProductInfo product={product} />
    </>
  );
}

export default ProductInfoDynamic;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;
  const product = (await getProducts(id)) as Product;

  return {
    props: {
      id,
      product,
    },
  };
};
