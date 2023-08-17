import React, { useEffect, useState } from 'react';
import { Category } from '@commercetools/platform-sdk';
import { getCategories } from '@/commercetools/utilsCommercTools';
import styles from './Categories.module.scss';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

function Categories() {
  const { t } = useTranslation();
  const { categoriesContainer } = styles;

  const [categories, setCategories] = useState<Category[]>([]);

  async function fetchCategories() {
    const categories = await getCategories() as Category[];

    if (categories) setCategories(categories);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const { push } = useRouter();

  return (
    <div className={categoriesContainer}>
      {categories.filter((el) => el.parent === undefined).map((el) => (
        <div key={el.id} onClick={() => push(`/sub-cat/${el.id}`)}>
          <p>{t(Object.values(el.name)[0])}</p>
        </div>
      ))}
    </div>
  );
}

export default Categories;
