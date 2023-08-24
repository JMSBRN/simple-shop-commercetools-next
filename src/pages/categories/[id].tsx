import {
  filterObjectAndReturnValue,
  getCategories,
  getCategoryNameWithId,
  getProductsByCategoryId,
} from '@/commercetools/utilsCommercTools';
import { Category } from '@commercetools/platform-sdk';
import { type GetStaticProps } from 'next';
import React from 'react';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '../../styles/SubCategories.module.scss';
import { useAppSelector } from '@/hooks/storeHooks';
import { useRouter } from 'next/router';

function Subcategories({
  subCategories,
  parentCategoryName,
}: {
  subCategories: Category[];
  parentCategoryName: string;
}) {
  const { language } = useAppSelector(selectCommerceTools);
  const { push } = useRouter();
  const { subCategoriesContainer, subCategoriesNames } = styles;
  const handleClick = async (el: Category) => {
    const products = await getProductsByCategoryId(el.id);

    if (products.length) {
      push(`/products/${el.id}`);
    } else {
      push(`/categories/${el.id}`);
    }
  };

  return (
    <div className={subCategoriesContainer}>
      <h2>{parentCategoryName}</h2>
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
  const id = params?.id as string;
  const categories = (await getCategories()) as Category[];
  const parentCategoryName = await getCategoryNameWithId(id, locale!);
  const subCategories = categories.filter(
    (el) => el.parent?.id === id
  );

  return {
    props: {
      subCategories,
      parentCategoryName,
      ...(await serverSideTranslations(locale || 'en', [
        'translation',
        'common',
      ])),
    },
  };
};
