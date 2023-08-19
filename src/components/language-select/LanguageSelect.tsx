import React, { useEffect, useState } from 'react';
import { fetchCategories } from '@/features/thunks/FetchCategories';
import { getLanguages } from '@/commercetools/utilsCommercTools';
import { setLanguage } from '@/features/commerceTools/CommerceToolsSlice';
import { useAppDispatch } from '@/hooks/storeHooks';

function LanguageSelect() {
  const dispatch = useAppDispatch();
  const [languages, setLanguages] = useState<string[]>([]);

  async function fetchFunction() {
    const res = await getLanguages();

    if (res) setLanguages(res);
  }

  useEffect(() => {
    fetchFunction();
  }, []);

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    dispatch(setLanguage(value));
    dispatch(fetchCategories());
  };
  
  return (
    <>
      <select onChange={(e) => changeLanguage(e)}>
        <option value={'en-US'}>
           default language
        </option>
        {languages.map((el, idx) => (
          <option key={idx} value={el}>
            {el}
          </option>
        ))}
      </select>
    </>
  );
}

export default LanguageSelect;
