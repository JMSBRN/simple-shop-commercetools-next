import {
  getCategoryNameWithId,
  getProductsByCategoryId,
} from '@/commercetools/utils/utilsCommercTools';
import { GetServerSideProps } from 'next';
import { Product } from '@commercetools/platform-sdk';
import ProductCard from '@/components/product-card/ProductCard';
import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '../../styles/Products.module.scss';
import { useRouter } from 'next/router';

function Products({ parentCatName, products }: { parentCatName: string; products: Product[] }) {
  const { push } = useRouter();
  const {
    productsContainer,
    parentCategoryNameStyle,
    productWrapper,
    productInfoStyle
  } = styles;
  
  return (
    <>
      <div className={parentCategoryNameStyle}>{parentCatName}</div>
      <div className={productsContainer}>
          {products.map((el) => (
            <div key={el.id} className={productWrapper}>
              <ProductCard product={el} />
              <div className={productInfoStyle} onClick={() => push(`/product-info/${el.id}`)}/>
            </div>
          ))}
      </div>
    </>
  );
}
export default Products;

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
  const catId = params?.categoryId as string;
  const parentCatName = await getCategoryNameWithId(catId, locale!);
  const products = await getProductsByCategoryId(catId);

  return {
    props: {
      parentCatName,
      products,
      ...(await serverSideTranslations(locale || 'en', [
        'translation',
        'common',
      ])),
    },
  };
};
