import { GetStaticPaths, type GetStaticProps } from 'next';
import { Category } from '@commercetools/platform-sdk';
import React from 'react';
import { apiRoot } from '@/commercetools/BuildClient';
import styles from '../../styles/SubCategories.module.scss';
import { useRouter } from 'next/router';

function Subcategories({ subCategories }: { subCategories: Category[] }) {
  const { push } = useRouter();
  const { subCategoriesContainer, subCategoriesNames } = styles;
  const handleClick = (el: Category) => {
      push(`/sub-cat/products/${el.id}`);

    console.log(el.parent);
  };

  return (
    <div className={subCategoriesContainer}>
      <h2>Sub Categories</h2>
      <div className={subCategoriesNames}>
        {subCategories.map((el) => (
          <div key={el.id} onClick={() => handleClick(el)}>
            <div className="">{Object.values(el.name)[0]}</div>
            <div className="">{''}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Subcategories;

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await apiRoot.categories().get().execute();
  const { results } = res.body;
  const paths = results
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
  const res = await apiRoot.categories().get().execute();
  const { results } = res.body;
  const subCategories: Category[] = results.filter(
    (el) => el.parent?.id === params?.id
  );

  return {
    props: {
      subCategories,
    },
  };
};
