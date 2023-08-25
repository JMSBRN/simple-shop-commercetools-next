import { Category, Product } from '@commercetools/platform-sdk';
import React, { useCallback, useEffect, useState } from 'react';
import {
  getCategories,
  getCategoryNameWithId,
  getProductsByCategoryId,
} from '@/commercetools/utilsCommercTools';
import { GetStaticProps } from 'next';
import ProductCard from '@/components/product-card/ProductCard';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '../../styles/Products.module.scss';
import { useAppSelector } from '@/hooks/storeHooks';
import { useRouter } from 'next/router';

function Products({ products }: { products: Product[] }) {
  const { query } = useRouter();
  const { id } = query;
  const {
    productsContainer,
    parentCategoryNameStyle,
  } = styles;
  const [parentCategoryName, setParentCategoryName] = useState<string>('');
  const { language } = useAppSelector(selectCommerceTools);
  const fetchFn = useCallback(async () => {
    const res = await getCategoryNameWithId(id as string, language);

    setParentCategoryName(res);
  }, [id, language]);

  useEffect(() => {
    fetchFn();
    return () => {
      setParentCategoryName('');
    };
  }, [fetchFn]);

  return (
    <>
      <div className={parentCategoryNameStyle}>{parentCategoryName}</div>
      <div className={productsContainer}>
          {products.map((el) => (
            <div key={el.id}>
              <ProductCard product={el} />
            </div>
          ))}
      </div>
    </>
  );
}
export const getStaticPaths = async ({ locales }: { locales: string[] }) => {
  const categories = (await getCategories()) as Category[];
  const paths = categories.flatMap((el) =>
    locales?.map((locale) => ({
      params: {
        id: el.id,
      },
      locale,
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
      ...(await serverSideTranslations(locale || 'en', [
        'translation',
        'common',
      ])),
    },
  };
};
