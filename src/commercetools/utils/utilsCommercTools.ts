import { Attribute, Category } from '@commercetools/platform-sdk';
import { apiRoot } from '../BuildClient';
import colorIcon from '../../../public/svgs/colors.svg';
import sizeIcon from '../../../public/svgs/size.svg';
import weightIcon from '../../../public/svgs/weight.svg';

export async function getProducts(id?: string) {
  if (id) {
    const res = await apiRoot.products().withId({ ID: id }).get().execute();

    return res.body;
  } else {
    const res = await apiRoot.products().get().execute();
    const { results } = res.body;

    return results;
  }
}

export async function getProductsByCategoryId(id: string) {
  const res = await apiRoot
    .products()
    .get({
      queryArgs: {
        where: `masterData(current(categories(id="${id}")))`,
      },
    })
    .execute();

  return res.body.results;
}

export async function getCategories(id?: string) {
  if (id) {
    const res = await apiRoot.categories().withId({ ID: id }).get().execute();

    return res.body;
  } else {
    const res = await apiRoot.categories().get().execute();
    const { results } = res.body;

    return results;
  }
}

export  async function getCategoryNameWithId (id: string, language: string) {
  const res = await getCategories(id as string) as Category;
  
  return (filterObjectAndReturnValue(res.name, language)) as string;
};

export async function getMainParentId(id: string) {
  const res = await getCategories(id as string) as Category;
  
  return res.ancestors[0].id;
}

export async function getLanguages() {
  const res = await apiRoot.get().execute();
  
  return res.body.languages;
}
export async function getCountries() {
  const res = await apiRoot.get().execute();
  
  return res.body.countries;
}

export function filterObjectAndReturnValue(
  obj: { [key: string]: string },
  fieldName: string
) {
  if (obj.hasOwnProperty(fieldName)) {
    return obj[fieldName];
  } else {
    return null;
  }
}

export function moveLanguageToFirstPosition(
  languages: string[],
  currentLanguage?: string
): string[] {
  if (currentLanguage) {
    const indexOfCurrentLanguage = languages.indexOf(currentLanguage);

    if (indexOfCurrentLanguage !== -1) {
      // Create a new array with the current language in the first position
      return [
        currentLanguage,
        ...languages.slice(0, indexOfCurrentLanguage),
        ...languages.slice(indexOfCurrentLanguage + 1),
      ];
    }
  } else {
    const indexOfEn = languages.indexOf('en');

    if (indexOfEn !== -1) {
      // Create a new array with 'en' in the first position
      return [
        'en',
        ...languages.slice(0, indexOfEn),
        ...languages.slice(indexOfEn + 1),
      ];
    }
  }

  // If the current language is not found and no current language is provided,
  // or if the 'en' language is not found, return the original array as-is.
  return languages;
}

export function setLanguageFromCountry (country: string) {
   switch (country) {
    case 'GB':
      return 'en';
    case 'IL':
      return 'he-IL';
    case 'DE':
      return 'de';
    case 'FR':
      return 'fr';
    default:
      return 'en';
   };
  }

  export   function setIconSrcForAtribute(atribute: Attribute) {
    const { name } = atribute;
  
     if(name.includes('Color')) {
      return colorIcon;
     } else if (name.includes('Weight')){
      return weightIcon;
     } else if (name.includes('Size')) {
      return sizeIcon;
     }
     return null;
  } 
