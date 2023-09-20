import React, { useState } from 'react';
import { BaseAddress } from '@commercetools/platform-sdk';
import styles from './BillingAddressForm.module.scss';

function BillingAddressForm({
  formRef,
  onSubmit,
}: {
  formRef: React.LegacyRef<HTMLFormElement> | undefined;
  onSubmit: (updatedAddress: BaseAddress) => void;
}) {
  const { billingFormContainer, inputRow, inputContainer } = styles;
  const [formData, setFormData] = useState<BaseAddress>({} as BaseAddress);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(formData);
  };
  const addressFields: (keyof BaseAddress)[][] = [
    ['firstName', 'lastName'],
    ['postalCode', 'city'],
    ['streetName', 'streetNumber'],
    ['additionalStreetInfo'],
    ['building', 'apartment'],
    ['company', 'department'],
    ['email', 'phone'],
  ];

  const renderInputField = (
    fieldName: keyof BaseAddress,
    fieldType?: string,
    required: boolean = true
  ) => (
    <div key={fieldName}>
      <label>
        {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
        {required && <span >*</span>}
        <input
          type={fieldType || 'text'}
          name={fieldName}
          value={formData[fieldName] || ''}
          onChange={handleChange}
          //required={required}
        />
      </label>
    </div>
  );
  const renderTextAreaField = (
    fieldName: keyof BaseAddress,
    required: boolean = true
  ) => (
    <div key={fieldName}>
      <label>
        {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
        {required && <span >*</span>}
        <textarea
          name={fieldName}
          value={formData[fieldName] || ''}
          onChange={handleChange}
          //required={required}
        />
      </label>
    </div>
  );

  return (
    <div className={billingFormContainer}>
      <form ref={formRef} onSubmit={handleSubmit}>
        {addressFields.map((pair, idx) => (
          <div className={inputRow} key={idx}>
            {pair.map((el, idx) => (
              <div className={inputContainer} key={idx}>
                {(el === 'additionalStreetInfo') ? renderTextAreaField(el, false) : (
                 el === 'email' ? renderInputField(el, 'email') : renderInputField(el) 
                )}
              </div>
            ))}
          </div>
        ))}
      </form>
    </div>
  );
}

export default BillingAddressForm;
