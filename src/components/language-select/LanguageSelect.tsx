import React, { useCallback, useEffect, useState } from 'react';
import {
  getLanguages,
  moveLanguageToFirstPosition,
} from '@/commercetools/utilsCommercTools';
import { fetchCategories } from '@/features/thunks/FetchCategories';
import { setLanguage } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './LanguagesSelect.module.scss';
import { useAppDispatch } from '@/hooks/storeHooks';

function LanguageSelect() {
  const { languagesSelectContainer } = styles;
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

    dispatch(setLanguage(value));
    dispatch(fetchCategories());
    window.localStorage.setItem('lang', JSON.stringify(value));
  };

  return (
    <div className={languagesSelectContainer}>
      {!!languages.length && (
        <select onChange={(e) => changeLanguage(e)}>
          {languages.map((el, idx) => (
            <option key={idx} value={el}>
              {el}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default LanguageSelect;
