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

export async function getProductsByCategoryId(id: string) {
     const res = await apiRoot.products().get({
      queryArgs: {
        where: `masterData(current(categories(id="${id}")))`
      }
     }).execute();

     return res.body.results;
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
export async function getLanguages() {
    const res =  await apiRoot.get().execute();
    
     return res.body.languages;
 
};

export function filterObjectAndReturnValue(obj: { [key: string]: string }, fieldName: string) {
  if (obj.hasOwnProperty(fieldName)) {
    return obj[fieldName];
  } else {
    return null;
  }
}