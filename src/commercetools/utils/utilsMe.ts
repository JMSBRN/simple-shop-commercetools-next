import { ErrorResponse, MyCustomerDraft } from '@commercetools/platform-sdk';
import { apiRoot } from '../BuildClient';

export const LoginMe = async (email: string, password: string) => {
  return await apiRoot
    .me()
    .login()
    .post({
      body: {
        email,
        password,
      },
    })
    .execute()
    .then((d) => {
      return d;
    })
    .catch((e: ErrorResponse) => {
      return e.message;
    });
};
export const RegistrationMe = async (args: MyCustomerDraft) => {
  const { email, firstName, lastName, password } = args;

  return await apiRoot
    .me()
    .signup()
    .post({
      body: {
        email,
        firstName,
        lastName,
        password,
      },
    })
    .execute()
    .then((d) => {
      return d;
    })
    .catch((e: ErrorResponse) => {
      return e.message;
    });
};
