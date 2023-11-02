import React, { useCallback, useEffect, useState } from 'react';
import {
  selectCommerceTools,
  setCountry,
  setErrorMessage,
} from '@/features/commerceTools/CommerceToolsSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { getCountries } from '@/commercetools/utils/utilsCommercTools';
import { isErrorResponse } from '@/commercetools/utils/utilsApp';
import styles from './CountrySelect.module.scss';

function CountrySelect() {
  const dispatch = useAppDispatch();
  const { carts } = useAppSelector(selectCommerceTools);
  const [countries, setCountries] = useState<string[]>([]);
  const [currentCountry, setCurrentCountry] = useState<string>('');
  const isCartsCreated = !!carts.length;

  const fetchFunction = useCallback(
    async function () {
      const res = await getCountries();
    
      if(!Array.isArray(res)) {
        if(res.message === 'Failed to fetch')
        dispatch(setErrorMessage('Please check internet connection'));
      }
   
      const currentCountryFromLocal = JSON.parse(
        window.localStorage.getItem('country') || '"GB"'
      );

      setCurrentCountry(currentCountryFromLocal);

      dispatch(setCountry(currentCountry));
      if (!isErrorResponse(res) && Array.isArray(res)) {
       const resWithoutStartPrefix=  res.map(c => {
          return c.substring(3);
        });

        setCountries(resWithoutStartPrefix);
      }
    },
    [currentCountry, dispatch]
  );

  useEffect(() => {
    fetchFunction();
  }, [fetchFunction]);

  const handleChangeCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    console.log(value);
    
    setCurrentCountry(value);
    dispatch(setCountry(value));
    window.localStorage.setItem('country', JSON.stringify(value));
  };

  return (
    <div className={styles.countrySelectContainer}>
      {!!countries.length && (
        <select
          onChange={(e) => handleChangeCountry(e)}
          defaultValue={currentCountry}
          disabled={isCartsCreated}
        >
          {countries.map((el, idx) => (
            <option key={idx} value={el}>
              {el}
            </option>
          ))}
        </select>
      )}
      {!isCartsCreated && <div>select avalible country</div>}
    </div>
  );
}

export default CountrySelect;
