import { apiRoot, getApiRootWithPasswordFlow } from '../BuildClient';
import { MyCustomerDraft } from '@commercetools/platform-sdk';

export const Login = async (
  email: string,
  password: string,
  anonimousCartId?: string
) => {
  if (anonimousCartId) {
    return await apiRoot
      .login()
      .post({
        body: {
          email,
          password,
          anonymousCart: {
            typeId: 'cart',
            id: anonimousCartId,
          },
          anonymousCartSignInMode: 'MergeWithExistingCustomerCart',
          updateProductData: true,
        },
      })
      .execute();
  }
  return await apiRoot
    .me()
    .login()
    .post({
      body: {
        email,
        password,
      },
    })
    .execute();
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
    .execute();
};

export const getMyCarts = async (
  email: string,
  password: string,
  ID?: string
) => {
  const apiRootWithPass = getApiRootWithPasswordFlow(email, password);

  if (ID)
    return (await apiRootWithPass.me().carts().withId({ ID }).get().execute())
      .body;
  return (await apiRootWithPass.me().carts().get().execute()).body.results;
};
