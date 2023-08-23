import {
  filterObjectAndReturnValue,
  getCategories,
  getProductsByCategoryId,
} from '@/commercetools/utilsCommercTools';
import { Category } from '@commercetools/platform-sdk';
import { type GetStaticProps } from 'next';
import Link from 'next/link';
import React from 'react';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '../../styles/SubCategories.module.scss';
import { useAppSelector } from '@/hooks/storeHooks';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

function Subcategories({ subCategories }: { subCategories: Category[] }) {
  const  { language } = useAppSelector(selectCommerceTools);
  const { push } = useRouter();
  const { subCategoriesContainer, subCategoriesNames } = styles;
  const { t } = useTranslation('common');
  const handleClick = async (el: Category) => {
    const products = await getProductsByCategoryId(el.id);

    if (products.length) {
      push(`/products/${el.id}`);
    } else {
      push(`/third-level/${el.id}`);
    }
  };

  return (
    <div className={subCategoriesContainer}>
      <Link href={'/'}>{t('category.home-link')}</Link>
      <h2>{t('category.title')}</h2>
      <div className={subCategoriesNames}>
        {subCategories.map((el) => (
          <div key={el.id} onClick={() => handleClick(el)}>
            <div className="">
              {filterObjectAndReturnValue(el.name, language)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Subcategories;

export const getStaticPaths = async ({ locales }: { locales: string[] }) => {
  const categories = (await getCategories()) as Category[];

  const paths = categories
  .filter((el) => el.parent !== undefined)
  .flatMap((el) =>
    locales?.map((locale: string) => ({
      params: {
        id: el.parent?.id,
      },
      locale,
    }))
  );

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {

  const categories = (await getCategories()) as Category[];
  const subCategories: Category[] = categories.filter(
    (el) => el.parent?.id === params?.id
  );

  return {
    props: {
      subCategories,
      ...(await serverSideTranslations( locale || 'en', ['translation', 'common']))
    },
  };
};
