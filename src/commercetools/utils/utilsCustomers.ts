import { Customer, ErrorResponse } from '@commercetools/platform-sdk';
import { ClientResponse } from '@commercetools/sdk-client-v2';
import { apiRoot } from '../BuildClient';

export const getCustomers = async (ID?: string) => {
    if(ID) return ( await apiRoot.customers().withId({ ID }).get().execute()
    .then((d) => {
      return d;
    })
    .catch((e: ErrorResponse) => {
      return e;
    }));

    return ( await apiRoot.customers().get().execute()
    .then((d) => {
      return d.body.results;
    })
    .catch((e: ErrorResponse) => {
      return e;
    }));
};
export const deleteCustomer = async (ID: string ) => {
    const { body } = (await getCustomers(ID)) as ClientResponse<Customer>;
    const { version } = body!;

    if(ID) return ( await apiRoot.customers().withId({ ID }).delete({
        queryArgs: {
            version
        }
    }).execute()).body;
};
