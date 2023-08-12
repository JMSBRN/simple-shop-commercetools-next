import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSelect() {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>('');

  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    i18n.changeLanguage(value);
  };

  return (
    <>
      <select onChange={(e) => changeLanguage(e)} value={currentLanguage}>
        <option value="en">en</option>
        <option value="de">de</option>
      </select>
    </>
  );
}

export default LanguageSelect;
