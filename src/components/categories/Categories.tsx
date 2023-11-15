import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { Category } from '@commercetools/platform-sdk';
import Loader from '../loader/Loader';
import { fetchCategories } from '@/features/thunks/FetchCategories';
import { filterObjectAndReturnValue } from '@/commercetools/utils/utilsCommercTools';
import { isInternetConnectionOnline } from '@/commercetools/utils/utilsApp';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './Categories.module.scss';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

function Categories() {
  const { categoriesContainer, dashBoardLInk } = styles;
  const { categories, status, language, userName } =
    useAppSelector(selectCommerceTools);
  const { push, locale } = useRouter();
  const dispatch = useAppDispatch();
  const [isOnline, setIsOnline] = useState(true);
  const { t } = useTranslation('common');

  useEffect(() => {
    setIsOnline(isInternetConnectionOnline());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleClickOnCategories = async (category: Category) => {
    push(`/categories/${category.id}`, undefined, { locale });
  };

  return (
    <div className={categoriesContainer}>
      {!isOnline && (
        <div style={{ color: 'red' }}>
          You are offline. Please check your internet connection.
        </div>
      )}
      {status === 'loading' && isOnline && <Loader />}
      {categories
        .filter((el) => el.parent === undefined)
        .map((el) => (
          <div key={el.id} onClick={() => handleClickOnCategories(el)}>
            <p>{filterObjectAndReturnValue(el.name, language)}</p>
          </div>
        ))}
      {userName && (
        <div className={dashBoardLInk} onClick={() => push('/user/dashboard')}>
          {t('dashBoard')}
        </div>
      )}
    </div>
  );
}

export default Categories;
