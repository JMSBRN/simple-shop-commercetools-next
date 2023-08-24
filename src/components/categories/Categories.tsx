import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import Loader from '../loader/Loader';
import { fetchCategories } from '@/features/thunks/FetchCategories';
import { filterObjectAndReturnValue } from '@/commercetools/utilsCommercTools';
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
 
  return (
    <div className={categoriesContainer}>
     { status === 'loading' && <Loader />}
      {categories.filter((el) => el.parent === undefined).map((el) => (
        <div key={el.id} onClick={() => push(`/categories/${el.id}`, undefined, { locale })}>
          <p>{filterObjectAndReturnValue(el.name, language)}</p>
        </div>
      ))}
    </div>
  );
}

export default Categories;
