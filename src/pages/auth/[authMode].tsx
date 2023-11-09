import { Login, RegistrationMe } from '@/commercetools/utils/utilsMe';
import React, { useRef, useState } from 'react';
import {
  getDecryptedDataFromCookie,
  setEncryptedDataToCookie,
} from '@/commercetools/utils/secureCookiesUtils';
import {
  selectCommerceTools,
  setErrorMessage,
  setUserName,
} from '@/features/commerceTools/CommerceToolsSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { AuthCustomerDraftFields } from '@/components/forms/formsInterfaces';
import AuthForm from '@/components/forms/auth-form/AuthForm';
import ButtonWithLoader from '@/commercetools/buttons/buttonWithLoader/ButtonWithLoader';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { UserData } from '@/interfaces';
import { getCarts } from '@/commercetools/utils/utilsCarts';
import { isErrorResponse } from '@/commercetools/utils/utilsApp';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '../../styles/AuthPage.module.scss';
import { useRouter } from 'next/router';

function AuthPage({ params }: { params: ParsedUrlQuery }) {
  const dispatch = useAppDispatch();
  const { errorMessage } = useAppSelector(selectCommerceTools);
  const formRef = useRef<HTMLFormElement | null>(null);
  const { push } = useRouter();
  const loginFormFields: (keyof AuthCustomerDraftFields)[][] = [
    ['email'],
    ['password'],
  ];
  const signOutFormFields: (keyof AuthCustomerDraftFields)[][] = [
    ['firstName'],
    ['email'],
    ['password'],
    ['password_Confirm'],
  ];
  const { authMode } = params;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentCartId = JSON.parse(
    getDecryptedDataFromCookie('currentCartId')!
  ) as string | undefined;
  const pushUrl = currentCartId ? '/user/dashboard' : '/';

  const onSubmitForm = async (e?: AuthCustomerDraftFields) => {
    dispatch(setErrorMessage(''));
    if (e?.email) {
      const { email, password, firstName } = e;

      switch (authMode) {
        case 'login':
          setIsLoading(true);
          const cartsResult = await getCarts();

          if (!isErrorResponse(cartsResult) && Array.isArray(cartsResult)) {
              const anonimousCartId = cartsResult
                .filter((c) => c.cartState === 'Active')
                .find((c) => c.id === currentCartId || '')?.id;
                
                console.log(anonimousCartId);
                
              const res = await Login(email, password, anonimousCartId);
  
              if (isErrorResponse(res)) {
                dispatch(setErrorMessage(res.message));
                setIsLoading(false);
              } else {
                if (res?.statusCode === 200) {
                  const { customer } = res.body;
                  const { id, firstName } = customer;
  
                  if (firstName) {
                    const userData: UserData = {
                      customerId: id,
                      firstName,
                      email,
                      password,
                    };
  
                    dispatch(setUserName(firstName));
                    setEncryptedDataToCookie('userData', userData);
                    setIsLoading(true);
                  }
                  push(pushUrl);
                }
              }
          }
          return;
        case 'registration':
          setIsLoading(true);
          const result = await RegistrationMe({
            email,
            password,
            firstName,
          });

          if (isErrorResponse(result)) {
            dispatch(setErrorMessage(result.message));
            setIsLoading(false);
          } else {
            if (result.statusCode === 201) {
              push('/auth/login');
              setIsLoading(false);
            }
          }

          return;
        default:
          return;
      }
    }
  };
  const handleClickSubmitBtn = () => {
    onSubmitForm();
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <div className={styles.authPageContainer}>
      <h3>{authMode === 'login' ? 'login' : 'Register'}</h3>
      <AuthForm
        formRef={formRef}
        onSubmit={onSubmitForm}
        formFields={authMode === 'login' ? loginFormFields : signOutFormFields}
        errorMessage={errorMessage}
        isConfirmPasswordExisted={authMode === 'registration'}
      />
      <ButtonWithLoader
        isLoading={isLoading}
        onClick={handleClickSubmitBtn}
        text="submit"
      />
      {authMode === 'login' && (
        <Link
          href={'/auth/registration'}
          onClick={() => dispatch(setErrorMessage(''))}
        >
          Go to registration
        </Link>
      )}
    </div>
  );
}

export default AuthPage;

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => ({
  props: {
    params,
    ...(await serverSideTranslations(locale || 'en', [
      'translation',
      'common',
    ])),
  },
});
