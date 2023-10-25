import { apiRoot, getApiRootWithPasswordFlow } from '../BuildClient';
import { CustomerInfo } from '@/interfaces';
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
export const getMyDetails = async (email: string, password: string) => {
  const apiRootWithPass = getApiRootWithPasswordFlow(email, password);

  return await apiRootWithPass.me().get().execute();
};

export const updateMyDetails = async (
  email: string,
  password: string,
  customerInfo: CustomerInfo,
  customerVersion: number
) => {
  const apiRootWithPass = getApiRootWithPasswordFlow(email, password);

  if (customerInfo.firstName) {
    const {
      salutation,
      firstName,
      middleName,
      lastName,
      companyName,
      dateOfBirth,
    } = customerInfo;

   return (await apiRootWithPass
      .me()
      .post({
        body: {
          version: customerVersion,
          actions: [
            {
              action: 'setSalutation',
              salutation,
            },
            {
              action: 'setFirstName',
              firstName,
            },
            {
              action: 'setMiddleName',
              middleName,
            },
            {
              action: 'setLastName',
              lastName,
            },
            {
              action: 'setCompanyName',
              companyName,
            },
            {
              action: 'setDateOfBirth',
              dateOfBirth,
            },
          ],
        },
      })
      .execute());
  }
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
export const getMyOrders = async (
  email: string,
  password: string,
  ID?: string
) => {
  const apiRootWithPass = getApiRootWithPasswordFlow(email, password);

  if (ID)
    return (await apiRootWithPass.me().orders().withId({ ID }).get().execute())
      .body;
  return (await apiRootWithPass.me().orders().get().execute()).body.results;
};
