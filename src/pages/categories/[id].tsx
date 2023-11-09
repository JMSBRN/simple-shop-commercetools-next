import React, { useEffect, useState } from 'react';
import {
  filterObjectAndReturnValue,
  getCategoryNameWithId,
  getMainParentId,
  getProductsByCategoryId,
} from '@/commercetools/utils/utilsCommercTools';
import { Category } from '@commercetools/platform-sdk';
import { GetServerSideProps } from 'next';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '../../styles/Categories.module.scss';
import { useAppSelector } from '@/hooks/storeHooks';
import { useRouter } from 'next/router';

function Subcategories({
  parentCatName,
}: {
  mainCatName: string;
  parentCatName: string;
}) {
  const { language, categories } = useAppSelector(selectCommerceTools);
  const { push, query } = useRouter();
  const { subCategoriesContainer, subCategoriesNames, mainCategoryNameStyle } =
    styles;
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [mainCatName, setMainCatName] = useState<string>('');

  const handleClick = async (el: Category) => {
    const products = await getProductsByCategoryId(el.id);

    if (el.id && products.length) {
      push(`/products/${el.id}`);
    } else {
      if (el.ancestors.length) {
        push(`/categories/${el.id}`);
      }
    }
  };

  useEffect(() => {
    const fn = async () => {
      const id = await getMainParentId(query.id as string);

      if (id) {
        const catName = await getCategoryNameWithId(id, language);

        if(catName) setMainCatName(catName);
      }
    };

    fn();

    setSubCategories(categories.filter((c) => c.parent?.id === query.id));

    return () => {
      setMainCatName('');
    };
  }, [categories, language, query.id]);

  return (
    <div className={subCategoriesContainer}>
      <div className={mainCategoryNameStyle}>{mainCatName}</div>
      <h2>{parentCatName}</h2>
      <div className={subCategoriesNames}>
        {subCategories.map((el) => (
          <div key={el.id} onClick={() => handleClick(el)}>
            <div>{filterObjectAndReturnValue(el.name, language)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Subcategories;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
}) => {
  const cartId = params?.id as string;
  const parentCatName = await getCategoryNameWithId(cartId, locale!);

  return {
    props: {
      parentCatName,
      ...(await serverSideTranslations(locale || 'en-GB', [
        'translation',
        'common',
      ])),
    },
  };
};
