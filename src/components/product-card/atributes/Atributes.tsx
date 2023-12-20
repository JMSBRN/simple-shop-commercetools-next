import {
  filterObjectAndReturnValue,
  setIconSrcForAtribute,
} from '@/commercetools/utils/utilsCommercTools';
import { Attribute } from '@commercetools/platform-sdk';
import Image from 'next/legacy/image';
import React from 'react';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './Atributes.module.scss';
import { useAppSelector } from '@/hooks/storeHooks';

function Atributes({ atributes }: { atributes: Attribute[] }) {
  const {
    atributesContainer,
    atributeStyle,
    atributeValueStyle
  } = styles ;
  const { language } = useAppSelector(selectCommerceTools);

  function setAttributeValue(value: any, locale: string): string {
    if (typeof value === 'object') {
      return filterObjectAndReturnValue(value, locale) as string;
    }
    return value;
  }
  
  return (
    <div className={atributesContainer}>
      {atributes.map((el, idx) => (
        <div className={atributeStyle} key={idx}>
          {setIconSrcForAtribute(el) && (
            <>
              <Image
                src={setIconSrcForAtribute(el)}
                width={20}
                height={20}
                alt="acon for atribute"
              />
              <div className={atributeValueStyle}>
                {setAttributeValue(el.value.label, language)}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Atributes;
