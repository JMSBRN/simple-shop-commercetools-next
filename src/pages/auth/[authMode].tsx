import React, { useRef } from 'react';
import { AuthCustomerDraftFields } from '@/components/forms/formsInterfaces';
import AuthForm from '@/components/forms/auth-form/AuthForm';
import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { login } from '@/utils/utilsCustomers';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function AuthPage( { params }: { params: ParsedUrlQuery }) {
  const formRef = useRef<HTMLFormElement | null>(null);
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
    if(e?.email) {
      const { email, password } = e;

      await login(email, password);  

    }
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };
 const handleClickSubmitBtn = () => {
   onSubmitForm();
 };

  return (
    <div>
      { authMode === 'login' ? 'login': 'Register'}
      <br />
      <br />
      <br />
      <AuthForm
        formRef={formRef}
        onSubmit={onSubmitForm}
        formFields={
          authMode === 'login' ?
          loginFormFields : signOutFormFields }
      />
      <button onClick={handleClickSubmitBtn}>submit</button>
    </div>
  );
}

export default AuthPage;

export const getServerSideProps: GetServerSideProps = async ({ locale, params }) => ({
  props: {
      params,
    ...(await serverSideTranslations(locale || 'en', [
      'translation',
      'common',
    ])),
  },
});
