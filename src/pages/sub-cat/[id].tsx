import { Category, Product } from '@commercetools/platform-sdk';
import { GetStaticPaths, type GetStaticProps } from 'next';
import { getCategories, getProducts } from '@/commercetools/utilsCommercTools';
import React from 'react';
import styles from '../../styles/SubCategories.module.scss';
import { useRouter } from 'next/router';

function Subcategories({ subCategories }: { subCategories: Category[] }) {
  const { push } = useRouter();
  const { subCategoriesContainer, subCategoriesNames } = styles;
  const handleClick = async (el: Category) => {
    const products  = await getProducts() as Product[];

     const isProductExisted = 
     !!products.filter((pr) => pr.masterData.current.categories[0].id === el.id)[0];

     if (isProductExisted) {
       push(`/products/${el.id}`);
     } else {
       push(`/third-level/${el.id}`);
     };
  };

  return (
    <div className={subCategoriesContainer}>
      <h2>Sub Categories</h2>
      <div className={subCategoriesNames}>
        {subCategories.map((el) => (
          <div key={el.id} onClick={() => handleClick(el)}>
            <div className="">{Object.values(el.name)[0]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Subcategories;

export const getStaticPaths: GetStaticPaths = async () => {
 
  const categories  = await getCategories() as Category[];
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
  const categories  = await getCategories() as Category[];
  const subCategories: Category[] = categories.filter(
    (el) => el.parent?.id === params?.id
  );

  return {
    props: {
      subCategories,
    },
  };
};
