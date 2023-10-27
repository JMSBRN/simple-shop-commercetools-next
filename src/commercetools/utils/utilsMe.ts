import {
  Cart,
  ErrorResponse,
  MyCustomerDraft,
  Order,
} from '@commercetools/platform-sdk';
import { apiRoot, getApiRootWithPasswordFlow } from '../BuildClient';
import { CustomerInfo } from '@/interfaces';
import { deleteAllPaymentsFromPaymentInfo } from './utilsPayment';
import { deleteOrder } from './utilsOrders';

export const Login = async (
  email: string,
  password: string,
  anonymousCartId?: string
) => {
  if (anonymousCartId) {
    return await apiRoot
      .login()
      .post({
        body: {
          email,
          password,
          anonymousCart: {
            typeId: 'cart',
            id: anonymousCartId,
          },
          anonymousCartSignInMode: 'MergeWithExistingCustomerCart',
          updateProductData: true,
        },
      })
      .execute()
      .then((d) => {
        return d;
      })
      .catch((e: ErrorResponse) => {
        return e;
      });
  } else {
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
        return e;
      });
  }
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

    return await apiRootWithPass
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
      .execute();
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

export const deleteMyCart = async (
  email: string,
  password: string,
  ID?: string
) => {
  const apiRootWithPass = getApiRootWithPasswordFlow(email, password);

  if (ID) {
    const { version, paymentInfo } = (await getMyCarts(
      email,
      password,
      ID
    )) as Cart;

    const res = await apiRootWithPass
      .me()
      .carts()
      .withId({ ID })
      .delete({
        queryArgs: {
          version,
        },
      })
      .execute();

    if (res.statusCode === 200) {
      if (paymentInfo) {
        return await deleteAllPaymentsFromPaymentInfo(paymentInfo);
      }
      return false;
    }
  }
};

export const deleteAllMyCarts = async (
  email: string,
  password: string,
  customerId: string
) => {
  const myCarts = (await getMyCarts(email, password)) as Cart[];

  const deletePromises = myCarts
    .filter((c) => c.customerId === customerId)
    .map(async (c) => {
      try {
        await deleteMyCart(email, password, c.id);
      } catch (error) {
        return false;
      }
      return true;
    });

  const results = await Promise.all(deletePromises);

  if (results.includes(false)) {
    return false;
  }

  return true;
};
export const deleteAllMyOrders = async (
  email: string,
  password: string,
  customerId: string
) => {
  const myOrders = (await getMyOrders(email, password)) as Order[];

  const deletePromises = myOrders
    .filter((o) => o.customerId === customerId)
    .map(async (o) => {
      try {
        await deleteOrder(o.id, o.version);
      } catch (error) {
        return false;
      }
      return true;
    });

  const results = await Promise.all(deletePromises);

  if (results.includes(false)) {
    return false;
  }

  return true;
};
