import React, { useRef } from 'react';
import ButtonWithLoader from '@/commercetools/buttons/buttonWithLoader/ButtonWithLoader';
import InputField from '../input-field/InputField';
import styles from './ConfirmForm.module.scss';
import { useTranslation } from 'next-i18next';

function ConfirmForm({
  formRef,
  onSubmit,
  formData,
  handleChange,
  errorMessage,
  isLoading,
}: {
  formRef?: React.LegacyRef<HTMLFormElement>;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  isLoading?: boolean;
}) {
  const { formContainer, errorMessageStyle } = styles;
  const inputSubRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation('common');

  return (
    <div className={formContainer}>
      <form ref={formRef} onSubmit={onSubmit}>
        {Array.from(['password', 'passwordConfirm'], (el, idx) => (
          <div key={idx}>
            <InputField
              fieldName={el}
              fieldType="password"
              isPasswordConfirmMode={true}
              isRequired={true}
              formData={formData}
              handleChange={handleChange}
              autoCompleteType="current-password"
            />
          </div>
        ))}
        <ButtonWithLoader
          onClick={() => inputSubRef.current?.onclick}
          text={t('confirmTodelete')}
          isLoading={isLoading}
        />
        <input ref={inputSubRef} type="submit" style={{ display: 'none' }} />
      </form>
      <div className={errorMessageStyle}>{errorMessage}</div>
    </div>
  );
}

export default ConfirmForm;
