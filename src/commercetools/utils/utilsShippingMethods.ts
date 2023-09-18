import { apiRoot } from '../BuildClient';

export const getShippingMethodsWithCountry = async (country: string) => {
   return (await apiRoot.shippingMethods().matchingLocation().get({
    queryArgs: {
        country
    }
   }).execute()).body.results;  
};