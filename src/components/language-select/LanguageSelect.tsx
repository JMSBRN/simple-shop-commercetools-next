import React, { useCallback, useEffect, useState } from 'react';
import {
  getLanguages,
  moveLanguageToFirstPosition,
} from '@/commercetools/utils/utilsCommercTools';
import { fetchCategories } from '@/features/thunks/FetchCategories';
import { setLanguage } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './LanguagesSelect.module.scss';
import { toggleServerSideLaguage } from '@/utils/utilsApp';
import { useAppDispatch } from '@/hooks/storeHooks';
import { useRouter } from 'next/router';

function LanguageSelect() {
  const { languagesSelectContainer } = styles;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [languages, setLanguages] = useState<string[]>([]);

 const fetchFunction = useCallback(async function (){
    const res = await getLanguages();
    const currentLanguage = JSON.parse(window.localStorage.getItem('lang') || '"en"');

    dispatch(setLanguage(currentLanguage));
    if (res) setLanguages(moveLanguageToFirstPosition(res, currentLanguage));
  },[dispatch]);

  useEffect(() => {
    fetchFunction();
  }, [fetchFunction]);

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    toggleServerSideLaguage(router, value);
    dispatch(setLanguage(value));
    dispatch(fetchCategories());
    window.localStorage.setItem('lang', JSON.stringify(value));
  };

  return (
    <div className={languagesSelectContainer}>
      {!!languages.length && (
        <select onChange={(e) => changeLanguage(e)}>
          {languages.map((el, idx) => (
            <option key={idx} value={el}>{el}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default LanguageSelect;
