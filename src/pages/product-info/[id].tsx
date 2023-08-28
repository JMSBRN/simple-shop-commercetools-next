import AddToCard from '@/components/add-to-card/AddToCard';
import { GetStaticProps } from 'next';
import { Product } from '@commercetools/platform-sdk';
import ProductInfo from '@/components/product-info/ProductInfo';
import React from 'react';
import { getProducts } from '@/commercetools/utilsCommercTools';

function ProductInfoDynamic({ product }: { product: Product; }) {
  return (
    <>
    <AddToCard />
    <ProductInfo product={product} />
    </>
  );
}

export default ProductInfoDynamic;

export const getStaticPaths = async ({ locales }: { locales: string[] }) => {
  const products = await getProducts() as Product[];

  const paths = products.flatMap((el) => 
   locales?.map((locale) => ({
      params: {
        id: el.id
      },
      locale
   }))
  );

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
        id,
        product
      }
    };
};