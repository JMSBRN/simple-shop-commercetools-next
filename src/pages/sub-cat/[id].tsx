import {  GetStaticPaths, type GetStaticProps } from 'next';
import { Category } from '@commercetools/platform-sdk';
import React from 'react';
import { apiRoot } from '@/commercetools/BuildClient';

function Subcategories({ subCategory }: { subCategory: Category}) {

  return (
    <div>{
        Object.values(subCategory.slug)[0]
      }</div>
  );
}

export default Subcategories;

export const getStaticPaths:GetStaticPaths = async () => {
  const res = await apiRoot.categories().get().execute();
  const { results } = res.body;
   const paths = results.filter((el) => el.parent !== undefined).map((el) => ({
    params: {
      id: el.parent?.id
    }
   }));

   return {
    paths,
    fallback: false
   };
};

export const  getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await apiRoot.categories().get().execute();
  const { results } = res.body;
     const subCategory: Category= results.filter((el) => el.parent?.id === params?.id )[0];
     
     return {
      props: {
        subCategory
      }
     };
};

