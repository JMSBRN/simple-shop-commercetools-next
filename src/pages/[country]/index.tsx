import { GetServerSideProps } from 'next';
import React from 'react';
import { getCountries } from '@/commercetools/utilsCommercTools';
import { setCountry } from '@/features/commerceTools/CommerceToolsSlice';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

function Countries({ countries }:{ countries: string[] }) {
    const { push } = useRouter();
    const dispatch = useDispatch();
const handleChooseCountry = (el: string) => {
    dispatch(setCountry(el));
    push(`/${el}/`);
};

  return (
    <div>
        set country
        { countries?.map((el: string) => (
            <div className="" key={el}>
                <div className="" onClick={() => handleChooseCountry(el)}>{el}</div>
            </div>
        ))}
        </div>
  );
};

export default Countries;
export const getServerSideProps: GetServerSideProps = async () => {
    const countries = await getCountries();

    return {
        props: {
            countries
        }
    };
};