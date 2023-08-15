import { GetStaticPaths, GetStaticProps } from 'next';
import { Category } from '@commercetools/platform-sdk';
import React from 'react';
import { apiRoot } from '@/commercetools/BuildClient';
import { useRouter } from 'next/router';

function ThirdLevel({ categories }: { categories: Category[] }) {

    const { push, query } = useRouter();
    const { id } = query;

    return <div>{
        categories.filter((el) => el.parent?.id === id).map((el) => (
         <div key={el.id} onClick={() => push(`/products/${el.id}`)}>
           <div>{JSON.stringify(el.key)}</div>
         </div>
        ))
       }</div>;
}

export default ThirdLevel;

export const getStaticPaths: GetStaticPaths = async () => {
    const res = await apiRoot.categories().get().execute();
    const { results } = res.body;
    const paths = results.map((el) => (
        {
          params: {
            id: el.id
          }
        }
    ));
  
    return {
      paths,
      fallback: false,
    };
  };

  export const getStaticProps: GetStaticProps = async () => {
    const res = await apiRoot.categories().get().execute();
    const { results } = res.body;
  
      return {
        props: {
          categories: results
        }
      };
  };