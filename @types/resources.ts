type CommonType = typeof import('../public/locales/en-GB/common.json');
type FormType = typeof import('../public/locales/en-GB/form.json');
type TranslationType = typeof import('../public/locales/en-GB/translation.json');

type ResourcesType = {
  common: CommonType;
  translation: TranslationType;
  form: FormType;
};

const resources: ResourcesType = {
  common: require('../public/locales/en-GB/common.json'),
  translation: require('../public/locales/en-GB/translation.json'),
  form: require('../public/locales/en-GB/form.json'),
} as const;

export type { CommonType, TranslationType, FormType, ResourcesType };
export default resources;

