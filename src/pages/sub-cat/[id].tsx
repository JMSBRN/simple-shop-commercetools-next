import { GetStaticPaths, type GetStaticProps } from 'next';
import {
  filterObjectAndReturnValue,
  getCategories,
  getProductsByCategoryId,
} from '@/commercetools/utilsCommercTools';
import { Category } from '@commercetools/platform-sdk';
import Link from 'next/link';
import React from 'react';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from '../../styles/SubCategories.module.scss';
import { useAppSelector } from '@/hooks/storeHooks';
import { useRouter } from 'next/router';

function Subcategories({ subCategories }: { subCategories: Category[] }) {
  const  { language } = useAppSelector(selectCommerceTools);
  const { push } = useRouter();
  const { subCategoriesContainer, subCategoriesNames } = styles;
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
      <Link href={'/'}>home</Link>
      <h2>Sub Categories</h2>
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

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = (await getCategories()) as Category[];
  const paths = categories
    .filter((el) => el.parent !== undefined)
    .map((el) => ({
      params: {
        id: el.parent?.id,
      },
    }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const categories = (await getCategories()) as Category[];
  const subCategories: Category[] = categories.filter(
    (el) => el.parent?.id === params?.id
  );

  return {
    props: {
      subCategories,
    },
  };
};
