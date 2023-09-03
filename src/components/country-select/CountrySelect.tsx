import React, { useCallback, useEffect, useState } from 'react';
import { getCountries } from '@/commercetools/utils/utilsCommercTools';
import { setCountry } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './CountrySelect.module.scss';
import { useAppDispatch } from '@/hooks/storeHooks';

function CountrySelect() {
  const dispatch = useAppDispatch();
  const [countries, setCountries] = useState<string[]>([]);
  const [currentCountry, setCurrentCountry] = useState<string>('');

  const fetchFunction = useCallback(
    async function () {
      const res = await getCountries();

      const currentCountryFromLocal = JSON.parse(
        window.localStorage.getItem('country') || '"GB"'
      );

      setCurrentCountry(currentCountryFromLocal);

      dispatch(setCountry(currentCountry));
      if (res) setCountries(res);
    },
    [currentCountry, dispatch]
  );

  useEffect(() => {
    fetchFunction();
  }, [fetchFunction]);

  const handleChangeCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    setCurrentCountry(value);
    dispatch(setCountry(value));
    window.localStorage.setItem('country', JSON.stringify(value));
  };

  return (
    <div className={styles.countrySelectContainer}>
      {!!countries.length && (
        <select onChange={(e) => handleChangeCountry(e)} defaultValue={currentCountry}>
          {countries.map((el, idx) => (
            <option key={idx} value={el}>
              {el}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default CountrySelect;
