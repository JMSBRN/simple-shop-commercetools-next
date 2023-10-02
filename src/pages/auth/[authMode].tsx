import { LoginMe, RegistrationMe } from '@/commercetools/utils/utilsMe';
import React, { useRef, useState } from 'react';
import { AuthCustomerDraftFields } from '@/components/forms/formsInterfaces';
import AuthForm from '@/components/forms/auth-form/AuthForm';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

function AuthPage({ params }: { params: ParsedUrlQuery }) {
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
          const res = await LoginMe(email, password);

          if (typeof res === 'string') {
            setError(res);
          } else if (res.statusCode === 200) {
            push('/');
          }
          return;
        case 'registration':
          const result = await RegistrationMe({
            email,
            password,
            firstName,
            lastName,
          });

          if (typeof result === 'string') {
            setError(result);
          } else if (result.statusCode === 201) {
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
