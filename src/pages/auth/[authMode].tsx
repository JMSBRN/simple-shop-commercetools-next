import { Login, RegistrationMe } from '@/commercetools/utils/utilsMe';
import React, { useRef, useState } from 'react';
import { AuthCustomerDraftFields } from '@/components/forms/formsInterfaces';
import AuthForm from '@/components/forms/auth-form/AuthForm';
import { Cart } from '@commercetools/platform-sdk';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { UserData } from '@/interfaces';
import { getCarts } from '@/commercetools/utils/utilsCarts';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { setEncryptedDataToCookie } from '@/commercetools/utils/secureCookiesUtils';
import { setUserName } from '@/features/commerceTools/CommerceToolsSlice';
import { useAppDispatch } from '@/hooks/storeHooks';
import { useRouter } from 'next/router';

function AuthPage({ params }: { params: ParsedUrlQuery }) {
  const dispatch = useAppDispatch();
  const formRef = useRef<HTMLFormElement | null>(null);
  const { push } = useRouter();
  const [error, setError] = useState('');
  const loginFormFields: (keyof AuthCustomerDraftFields)[][] = [
    ['email'],
    ['password'],
  ];
  const signOutFormFields: (keyof AuthCustomerDraftFields)[][] = [
    ['firstName', 'lastName'],
    ['email'],
    ['password'],
  ];
  const { authMode } = params;

  const onSubmitForm = async (e?: AuthCustomerDraftFields) => {
    setError('');
    if (e?.email) {
      const { email, password, firstName, lastName } = e;

      switch (authMode) {
        case 'login':
          const carts = (await getCarts()) as Cart[];
          const anonimousCartId = carts
            .filter((c) => c.cartState === 'Active')
            .find((c) => c.anonymousId)?.id;

          const resLogin = await Login(email, password, anonimousCartId);

          if (resLogin.statusCode === 200) {
            const { customer } = resLogin.body;
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
            }

            push('/user/dashboard');
          }

          return;
        case 'registration':
          const result = await RegistrationMe({
            email,
            password,
            firstName,
            lastName,
          });

          if (result.statusCode === 201) {
            push('/auth/login');
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
    <div>
      {authMode === 'login' ? 'login' : 'Register'}
      <br />
      <br />
      <br />
      <AuthForm
        formRef={formRef}
        onSubmit={onSubmitForm}
        formFields={authMode === 'login' ? loginFormFields : signOutFormFields}
      />
      <button onClick={handleClickSubmitBtn}>submit</button>
      <div className="error" style={{ color: 'red' }}>
        {error}
        <br />
        <br />
        {authMode === 'login' && (
          <Link href={'/auth/registration'} onClick={() => setError('')}>
            Go to registration
          </Link>
        )}
      </div>
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
    ...(await serverSideTranslations(locale || 'en-GB', [
      'translation',
      'common',
    ])),
  },
});
