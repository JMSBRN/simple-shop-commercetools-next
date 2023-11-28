import { useAppSelector } from '@/hooks/storeHooks';
import { Category } from '@commercetools/platform-sdk';
import { filterObjectAndReturnValue } from '@/commercetools/utils/utilsCommercTools';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './Categories.module.scss';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

function Categories() {
  const { categoriesContainer, dashBoardLInk } = styles;
  const { categories, language, userName, status } =
    useAppSelector(selectCommerceTools);
  const { push, locale } = useRouter();
  const { t } = useTranslation('common');

  const handleClickOnCategories = async (categoryId: string) => {
    push(`/categories/${categoryId}`, undefined, { locale });
  };

  return (
    <div className={categoriesContainer}>
      {status === 'succeeded' && categories
        .filter((el) => el.parent === undefined)
        .map((el) => (
          <div key={el.id} onClick={() => handleClickOnCategories(el.id)}>
            <p>{filterObjectAndReturnValue(el.name, language)}</p>
          </div>
        ))}
      {(status === 'succeeded' && userName) && (
        <div data-testid="dashboard" className={dashBoardLInk} onClick={() => push('/user/dashboard')}>
          {t('dashBoard')}
        </div>
      )}
    </div>
  );
}

export default Categories;
