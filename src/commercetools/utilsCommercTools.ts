import { apiRoot } from './BuildClient';

export async function getProducts() {
    const res =  await apiRoot.products().get().execute();
    const { results } = res.body;

    return results;
};
export async function getCategories() {
    const res =  await apiRoot.categories().get().execute();
    const { results } = res.body;

    return results;
};