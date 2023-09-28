import { apiRoot } from '../BuildClient';

export const getCustomers = async (ID?: string) => {
    if(ID) return ( await apiRoot.customers().withId({ ID }).get().execute());
    return ( await apiRoot.customers().get().execute()).body.results;
};
export const deleteCustomerWithId = async (ID: string, version: number) => {
    if(ID) return ( await apiRoot.customers().withId({ ID }).delete({
        queryArgs: {
            version
        }
    }).execute()).body;
};