import { filterObjectAndReturnValue, getCategories } from '@/commercetools/utilsCommercTools';
import { Category } from '@commercetools/platform-sdk';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import React from 'react';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '../../styles/ThirdLevel.module.scss';
import { useAppSelector } from '@/hooks/storeHooks';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

function ThirdLevel({ categories }: { categories: Category[] }) {
  const  { language } = useAppSelector(selectCommerceTools);
  const { t } = useTranslation('common');
  const { push, query, back } = useRouter();
  const { id } = query;
  const { thirdLevelContainer, categoriesStyle, backLinkStyle } = styles;

  return (
    <div className={thirdLevelContainer}>
      <Link href={'/'}>{t('category.home-link')}</Link>
      <div className={backLinkStyle} onClick={() => back()}>Back</div>
      <h2>{t('category.title')}</h2>
      <div className={categoriesStyle}>
        {categories
          .filter((el) => el.parent?.id === id)
          .map((el) => (
            <div key={el.id} onClick={() => push(`/products/${el.id}`)}>
              <div>{filterObjectAndReturnValue(el.name, language)}</div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ThirdLevel;

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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const categories = await getCategories() as Category[];

  return {
    props: {
      categories,
      ...(await serverSideTranslations( locale || 'en', ['translation', 'common']))
    },
  };
};
