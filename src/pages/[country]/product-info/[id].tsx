import { getCountries, getProducts } from '@/commercetools/utilsCommercTools';
import { GetStaticProps } from 'next';
import { Product } from '@commercetools/platform-sdk';
import ProductInfo from '@/components/product-info/ProductInfo';
import React from 'react';

function ProductInfoDynamic({ product }: { product: Product }) {
  return (
    <ProductInfo product={product} />
  );
}

export default ProductInfoDynamic;

export const getStaticPaths = async ({ locales }: { locales: string[] }) => {
  const products = await getProducts() as Product[];
  const countries = await getCountries();
  const paths = countries.flatMap((country) => products.flatMap((el) => 
   locales?.map((locale) => ({
      params: {
        country,
        id: el.id
      },
      locale
   }))
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