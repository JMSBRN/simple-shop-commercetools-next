import { Category } from '@commercetools/platform-sdk';

export const mockCategories: Category[] = [
    {
      id: 'mockCategoryId1',
      version: 1,
      createdAt: '2023-11-25T00:00:00Z',
      lastModifiedAt: '2023-11-25T12:00:00Z',
      createdBy: {
      anonymousId: undefined
      },
      lastModifiedBy: {
       anonymousId: ''
      },
      name: { en: 'Mock Category 1' },
      slug: { en: 'mock-category-1' },
      description: { en: 'This is a mock category 1.' },
      ancestors: [],
      orderHint: '0.5',
      externalId: 'mockExternalId1',
      metaTitle: { en: 'Mock Category 1 Title' },
      metaDescription: { en: 'Mock Category 1 Description' },
      metaKeywords: { en: 'mock, category, keywords, 1' },
      custom: undefined,
      assets: [],
      key: 'mockCategoryKey1',
      parent: undefined,
    },
    {
      id: 'mockCategoryId2',
      version: 1,
      createdAt: '2023-11-26T00:00:00Z',
      lastModifiedAt: '2023-11-26T12:00:00Z',
      createdBy: {
       anonymousId: undefined
      },
      lastModifiedBy: {
        anonymousId: undefined
      },
      name: { en: 'Mock Category 2' },
      slug: { en: 'mock-category-2' },
      description: { en: 'This is a mock category 2.' },
      ancestors: [],
      orderHint: '0.6',
      externalId: 'mockExternalId2',
      metaTitle: { en: 'Mock Category 2 Title' },
      metaDescription: { en: 'Mock Category 2 Description' },
      metaKeywords: { en: 'mock, category, keywords, 2' },
      custom: undefined,
      assets: [],
      key: 'mockCategoryKey2',
      parent: undefined,
    },
  ];