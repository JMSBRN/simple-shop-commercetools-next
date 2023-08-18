import { GetStaticPaths, GetStaticProps } from 'next';
import { filterObjectAndReturnValue, getCategories } from '@/commercetools/utilsCommercTools';
import { Category } from '@commercetools/platform-sdk';
import React from 'react';
import styles from '../../styles/ThirdLevel.module.scss';
import { useRouter } from 'next/router';

function ThirdLevel({ categories }: { categories: Category[] }) {
  const { push, query } = useRouter();
  const { id } = query;
  const { thirdLevelContainer, categoriesStyle } = styles;

  return (
    <div className={thirdLevelContainer}>
      <h2>Third Level Categories</h2>
      <div className={categoriesStyle}>
        {categories
          .filter((el) => el.parent?.id === id)
          .map((el) => (
            <div key={el.id} onClick={() => push(`/products/${el.id}`)}>
              <div>{filterObjectAndReturnValue(el.name, 'en-US')}</div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ThirdLevel;

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await getCategories() as Category[];
  const paths = categories.map((el) => ({
    params: {
      id: el.id,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async () => {
  const categories = await getCategories() as Category[];

  return {
    props: {
      categories,
    },
  };
};
