import ButtonWithLoader from '@/components/buttons/buttonWithLoader/ButtonWithLoader';
import { CustomerInfo } from '@/interfaces';
import InputField from '../input-field/InputField';
import React from 'react';
import styles from './UpdateUserDataForm.module.scss';
import { useTranslation } from 'next-i18next';

function UpdateUserDataForm({
  formRef,
  refSubmitInput,
  formData,
  customerInfo,
  handleSubmit,
  handleChange,
  isLoading
}: {
  formRef: React.RefObject<HTMLFormElement>;  
  refSubmitInput: React.RefObject<HTMLInputElement>;  
  formData:  CustomerInfo;
  customerInfo: CustomerInfo;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}) {
    const { t } = useTranslation('common');

    const handleSubmitForm = async () => {
        refSubmitInput.current?.onsubmit;
      };

    const renderInputField = (
        fieldName: keyof CustomerInfo | string,
        fieldType?: string,
        defaultValue?: string | number | readonly string[],
        isrRequired?: boolean
      ) => {
        return (
          <InputField
            fieldName={fieldName}
            fieldType={fieldType}
            formData={formData}
            handleChange={handleChange}
            defaultValue={defaultValue}
            isRequired={isrRequired || false}
          />
        );
      };
      
  return (
    <form className={styles.updateCustomerInfoForm} ref={formRef} onSubmit={handleSubmit}>
      {Object.entries(customerInfo).map(([key, value]) => (
        <label key={key}>
          {key === 'dateOfBirth'
            ? renderInputField(key, 'date', value, true)
            : ['firstName', 'companyName'].includes(key)
            ? renderInputField(key, undefined, value, true)
            : renderInputField(key, undefined, value)}
        </label>
      ))}
      <ButtonWithLoader
        onClick={handleSubmitForm}
        text={t('submit')}
        isLoading={isLoading}
      />
      <input
        ref={refSubmitInput}
        type={t('submit')}
        style={{ display: 'none' }}
      />
    </form>
  );
}

export default UpdateUserDataForm;
