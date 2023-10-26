import { ClientResponse } from '@commercetools/sdk-client-v2';
import { Customer } from '@commercetools/platform-sdk';
import { apiRoot } from '../BuildClient';

export const getCustomers = async (ID?: string) => {
    if(ID) return ( await apiRoot.customers().withId({ ID }).get().execute());
    return ( await apiRoot.customers().get().execute()).body.results;
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
