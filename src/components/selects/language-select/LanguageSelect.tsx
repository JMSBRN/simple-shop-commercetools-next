import React, { useCallback, useEffect, useState } from 'react';
import {
  getLanguages,
  moveLanguageToFirstPosition,
} from '@/commercetools/utils/utilsCommercTools';
import {
  isErrorResponse,
  toggleServerSideLaguage,
} from '@/commercetools/utils/utilsApp';
import {
  selectCommerceTools,
  setLanguage,
} from '@/features/commerceTools/CommerceToolsSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import CustomSelect from '../custom-select/CustomSelect';
import { fetchCategories } from '@/features/thunks/FetchCategories';
import styles from './LanguagesSelect.module.scss';
import { useRouter } from 'next/router';

function LanguageSelect({ label }:{ label?: string }) {
  const { languagesSelectContainer, labelStyle, hidden } = styles;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { language } = useAppSelector(selectCommerceTools);
  const [languages, setLanguages] = useState<string[]>([]);
  const isLanguagesFetched = !!languages.length;

  const fetchFunction = useCallback(
    async function () {
      const res = await getLanguages();
      const currentLanguage = JSON.parse(
        window.localStorage.getItem('lang') || '"en-GB"'
      );

      dispatch(setLanguage(currentLanguage));
      if (!isErrorResponse(res))
        setLanguages(moveLanguageToFirstPosition(res, currentLanguage));
    },
    [dispatch]
  );

  useEffect(() => {
    fetchFunction();
  }, [fetchFunction]);

  const changeLanguage = (e: React.MouseEvent<HTMLOptionElement>) => {
    const { value } = e.currentTarget;

    toggleServerSideLaguage(router, value);
    dispatch(setLanguage(value));
    dispatch(fetchCategories());
    window.localStorage.setItem('lang', JSON.stringify(value));
  };

  return (
    <div className={languagesSelectContainer}>
      {isLanguagesFetched && (
      <CustomSelect 
        options={languages}
        selectedOption={language.substring(3)}
        onSelectOptionValue={changeLanguage}
        withSubstringMethod={true}
      />
      )}
      <div className={isLanguagesFetched ? labelStyle: hidden}>{label || ''}</div>
    </div>
  );
}

export default LanguageSelect;
