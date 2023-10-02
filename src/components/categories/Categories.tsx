import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { Category } from '@commercetools/platform-sdk';
import Loader from '../loader/Loader';
import { fetchCategories } from '@/features/thunks/FetchCategories';
import { filterObjectAndReturnValue } from '@/commercetools/utils/utilsCommercTools';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './Categories.module.scss';
import { useRouter } from 'next/router';

function Categories() {
  const { categoriesContainer } = styles;
  const { categories, status, language } = useAppSelector(selectCommerceTools);
  const { push, locale } = useRouter();
  const dispatch = useAppDispatch();

 useEffect(() => {
  dispatch(fetchCategories()); 
 }, [dispatch]);

 const  handleClickOnCategories = async (category: Category) => {
  const { id, parent } = category;

   console.log(parent);
  if(!parent?.id) {
    push(`/categories/${id}`, undefined, { locale });
  }
  push(`/products/${id}`);

 };
 
  return (
    <div className={categoriesContainer}>
     { status === 'loading' && <Loader />}
      {categories.filter((el) => el.parent === undefined).map((el) => (
        <div key={el.id} onClick={() => handleClickOnCategories(el)}>
          <p>{filterObjectAndReturnValue(el.name, language)}</p>
        </div>
      ))}
    </div>
  );
}

export default Categories;
