import React, { useEffect, useState } from 'react';
import { filterObjectAndReturnValue, getCategories } from '@/commercetools/utilsCommercTools';
import { Category } from '@commercetools/platform-sdk';
import Loader from '../loader/Loader';
import styles from './Categories.module.scss';
import { useRouter } from 'next/router';

function Categories() {
  const { categoriesContainer } = styles;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  async function fetchCategories() {
    const categories = await getCategories() as Category[];

    if (categories) {
     setLoaded(true);
     setCategories(categories);
  }
}
  useEffect(() => {
    fetchCategories();
  }, []);

  const { push } = useRouter();

  return (
    <div className={categoriesContainer}>
     { !loaded && <Loader />}
      {categories.filter((el) => el.parent === undefined).map((el) => (
        <div key={el.id} onClick={() => push(`/sub-cat/${el.id}`)}>
          <p>{filterObjectAndReturnValue(el.name, 'en-US')}</p>
        </div>
      ))}
    </div>
  );
}

export default Categories;
