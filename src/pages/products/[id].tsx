import { Category, Product } from '@commercetools/platform-sdk';
import { getCategories, getProductsByCategoryId } from '@/commercetools/utilsCommercTools';
import { GetStaticProps } from 'next';
import ProductCard from '@/components/product-card/ProductCard';
import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '../../styles/Products.module.scss';
import { useRouter } from 'next/router';

function Products({ products }: {products: Product[]}) {
  const { push } = useRouter();
  const { productsContainer, productsStyle, productInfoStyle } = styles;
  
  const handleGetProductInfo = (id: string) => {
    push(`/product-info/${id}`);
  };

  return (
    <div className={productsContainer}>
      <div className={productsStyle}>
        {products
          .map((el) => (
            <div key={el.id}>
              <div
                className={productInfoStyle}
                onClick={() => handleGetProductInfo(el.id)}
              >
                product info
              </div>
              <ProductCard product={el} />
            </div>
          ))}
      </div>
    </div>
  );
}
export const getStaticPaths = async ({ locales }: { locales: string[] }) => {
  const categories = await getCategories() as Category[];
  const paths = categories.flatMap((el) => 
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

export default Products;
export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const products = await getProductsByCategoryId(params?.id as string);

  return {
    props: {
      products,
      ...(await serverSideTranslations( locale || 'en', ['translation', 'common']))
    },
  };
};
