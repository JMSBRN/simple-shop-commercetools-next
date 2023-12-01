import React, { useCallback, useEffect } from 'react';
import {
  selectCommerceTools,
  setCountry,
} from '@/features/commerceTools/CommerceToolsSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { Countries } from '@/interfaces';
import CustomSelect from '../custom-select/CustomSelect';
import { fetchCountries } from '@/features/thunks/FetchCountries';
import styles from './CountrySelect.module.scss';

function CountrySelect({
  textMessage,
  label,
}: {
  textMessage: string;
  label: string;
}) {
  const { countrySelectContainer, selectedCountry, labelStyle } = styles;
  const dispatch = useAppDispatch();
  const { carts, country, countries } = useAppSelector(selectCommerceTools);
  const isCartsCreated = !!carts?.length;
  const isCountriesFetched = !!countries.length;

  const fetchFunction = useCallback(
    async function () {
      dispatch(fetchCountries());
      const currentCountryFromLocal: Countries = JSON.parse(
        window.localStorage.getItem('country') || '"GB"'
      );

      dispatch(setCountry(currentCountryFromLocal));
    },
    [dispatch]
  );

  useEffect(() => {
    fetchFunction();
  }, [fetchFunction]);

  const handleChangeCountry = (e: React.MouseEvent<HTMLOptionElement>) => {
    const { value } = e.currentTarget;
    const stringValue: Countries = value as Countries;

    dispatch(setCountry(stringValue));
    window.localStorage.setItem('country', JSON.stringify(stringValue));
  };

  return (
    <div data-testid="select-country" className={countrySelectContainer}>
      {isCountriesFetched && (
        <div>
          {!isCartsCreated && (
            <div className={styles.selectWrapper}>
              <CustomSelect
                options={countries.map((c) => {
                  return c.substring(3);
                })}
                selectedOption={country}
                onSelectOptionValue={handleChangeCountry}
              />
            </div>
          )}
          <div data-testid="selected-country" className={selectedCountry}>
            {isCartsCreated ? (
              <>
                {country && <>{country}</>}
                <div className={labelStyle}>{label}</div>
              </>
            ) : (
              <div className={labelStyle}>{country && textMessage}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CountrySelect;
