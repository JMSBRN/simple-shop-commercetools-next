import React, { useEffect, useState } from 'react';
import { Category } from '@commercetools/platform-sdk';
import { apiRoot } from '@/commercetools/BuildClient';
import styles from './Categories.module.scss';
import { useTranslation } from 'react-i18next';

function Categories() {
  const { t } = useTranslation();
  const { categoriesContainer } = styles;

  const [categories, setCategories] = useState<Category[]>([]);

  async function fetchCategories() {
    const res = await apiRoot.categories().get().execute();
    const { results } = res.body;

    if (results) setCategories(results);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className={categoriesContainer}>
      {categories.map((el) => (
        <div key={el.id}>
          <p>{t(Object.values(el.name)[0])}</p>
        </div>
      ))}
    </div>
  );
}

export default Categories;
