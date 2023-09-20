import { apiRoot } from '../BuildClient';

export const getPayments = async function name(ID?: string) {
    if (ID) {
        return (await apiRoot.payments().withId({ ID }).get().execute()).body;
      }
      return (await apiRoot.payments().get().execute()).body.results;
};

