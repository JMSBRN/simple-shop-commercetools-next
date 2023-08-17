import { apiRoot } from './BuildClient';

export async function getProducts(id?: string) {
    if(id) {
        const res =  await apiRoot.products().withId({ ID: id }).get().execute();

         return res.body;
       } else {
        const res =  await apiRoot.products().get().execute();
        const { results } = res.body;

        return results;
    }
};

export async function getCategories( id?: string) {
   if(id) {
    const res =  await apiRoot.categories().withId({ ID: id }).get().execute();

     return res.body;
   } else {
    const res =  await apiRoot.categories().get().execute();
    const { results } = res.body;

    return results;
   }
};