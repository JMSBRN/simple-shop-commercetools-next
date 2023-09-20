import { apiRoot } from '../BuildClient';

export const getShippingMethodsWithCountry = async (country: string) => {
   return (await apiRoot.shippingMethods().matchingLocation().get({
    queryArgs: {
        country
    }
   }).execute()).body.results;  
};
export const getShipingMethodByKey = async (key: string) => {
   return (await apiRoot.shippingMethods().withKey({ key }).get({
    queryArgs: {
        key
    }
   }).execute()).body;  
};
 
