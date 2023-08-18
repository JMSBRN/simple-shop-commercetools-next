import React, { useState } from 'react';

function LanguageSelect() {
  const [currentLanguage, setCurrentLanguage] = useState<string>('');

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
   
    //i18n.changeLanguage(value);

    setCurrentLanguage(value);
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
