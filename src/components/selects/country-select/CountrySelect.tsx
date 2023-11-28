import React, { useCallback, useEffect, useState } from 'react';
import {
  selectCommerceTools,
  setCountry,
  setErrorMessage,
} from '@/features/commerceTools/CommerceToolsSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import CustomSelect from '../custom-select/CustomSelect';
import { getCountries } from '@/commercetools/utils/utilsCommercTools';
import { isErrorResponse } from '@/commercetools/utils/utilsApp';
import styles from './CountrySelect.module.scss';

function CountrySelect({ selectCountryText }: { selectCountryText: string }) {
  const { countrySelectContainer, selectedCountry, hidden } = styles;
  const dispatch = useAppDispatch();
  const { carts, country } = useAppSelector(selectCommerceTools);
  const [countries, setCountries] = useState<string[]>([]);
  const [currentCountry, setCurrentCountry] = useState<string>('');
  const isCartsCreated = !!carts?.length;

  const fetchFunction = useCallback(
    async function () {
      const res = await getCountries();

      if (!Array.isArray(res)) {
        if (res.message === 'Failed to fetch')
          dispatch(setErrorMessage('Please check internet connection'));
      }

      const currentCountryFromLocal = JSON.parse(
        window.localStorage.getItem('country') || '"GB"'
      );

      setCurrentCountry(currentCountryFromLocal);

      dispatch(setCountry(currentCountry));
      if (!isErrorResponse(res) && Array.isArray(res)) {
        const resWithoutStartPrefix = res.map((c) => {
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

  const handleChangeCountry = (e: React.MouseEvent<HTMLOptionElement>) => {
    const { value } = e.currentTarget;

    setCurrentCountry(value);
    dispatch(setCountry(value));
    window.localStorage.setItem('country', JSON.stringify(value));
  };

  return (
    <div data-testid="select-country" className={countrySelectContainer}>
        {!isCartsCreated && (
        <div className={styles.selectMessage}>{selectCountryText}</div>
      )}
      <div
        data-testid="selected-country"
        className={!!isCartsCreated ? selectedCountry : hidden}
      >
        {country}
      </div>

      {!isCartsCreated && (
        <div className={styles.selectWrapper}>
          <CustomSelect
            options={countries}
            selectedOption={country}
            onSelectOptionValue={handleChangeCountry}
          />
        </div>
      )}
    </div>
  );
}

export default CountrySelect;
