import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getMyDetails, updateMyDetails } from '@/commercetools/utils/utilsMe';
import { Address } from 'cluster';
import { ClientResponse } from '@commercetools/sdk-client-v2';
import { Customer } from '@commercetools/platform-sdk';
import { CustomerInfo } from '@/interfaces';
import InputField from '../forms/input-field/InputField';
import { getCustomers } from '@/commercetools/utils/utilsCustomers';
import styles from './MyCustomer.module.scss';

function MyCustomer({ email, password }: { email: string; password: string }) {
  const {
    customerContainer,
    customerInfoContainer,
    customerInfoStyle,
    customerAddressStyle,
    customerBtnsContainer,
    updateUserInfoModal,
  } = styles;
  const [customer, setCustomer] = useState<Customer>({} as Customer);
  const [isAddresFormRendered, setIsAddresFormRendered] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<CustomerInfo>({} as CustomerInfo);
  const formRef = useRef<HTMLFormElement>(null);

  const fetchMyDetails = useCallback(async () => {
    if (email && password) {
      const res = await getMyDetails(email, password);

      if (res.statusCode === 200) {
        setCustomer(res.body);
      }
    }
  }, [email, password]);

  useEffect(() => {
    fetchMyDetails();
  }, [email, fetchMyDetails, password]);

  if (customer.id) {
    const {
      salutation,
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      companyName,
      addresses,
    } = customer;
    const customerInfo: CustomerInfo = {
      salutation,
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      companyName,
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (formRef.current) {
        const formDataObject: Record<string, any> = {};

        const formElements = Array.from(
          formRef.current.elements
        ) as HTMLInputElement[];

        formElements.forEach((element) => {
          if (element.name) {
            formDataObject[element.name] = element.value;
          }
        });
        const newFormData = formDataObject as CustomerInfo;

        console.log(newFormData);

        const { body } = (await getCustomers(
          customer.id
        )) as ClientResponse<Customer>;
        const { version } = body!;

        const res = await updateMyDetails(
          email,
          password,
          newFormData,
          version
        );

        if (res?.statusCode === 200) {
          setIsAddresFormRendered(false);
          fetchMyDetails();
        }
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    const renderInputField = (
      fieldName: keyof CustomerInfo | string,
      fieldType?: string,
      defaultValue?: string | number | readonly string[]
    ) => {
      return (
        <InputField
          fieldName={fieldName}
          fieldType={fieldType}
          formData={formData}
          handleChange={handleChange}
          defaultValue={defaultValue}
          isRequired={false}
        />
      );
    };
    const handleUpdateAccount = async () => {
      setIsAddresFormRendered(true);
    };

    return (
      <div className={customerContainer}>
        {isAddresFormRendered && (
          <div className={updateUserInfoModal}>
            <form ref={formRef} onSubmit={handleSubmit}>
              {Object.entries(customerInfo).map(([key, value]) => (
                <label key={key}>
                  {key === 'dateOfBirth'
                    ? renderInputField(key, 'date', value)
                    : renderInputField(key, undefined, value)}
                </label>
              ))}
              <input type="submit" />
            </form>
          </div>
        )}
        <div className={customerInfoContainer}>
          <div className={customerInfoStyle}>
            <h4>Customer Information</h4>
            {Object.entries(customerInfo).map(([key, value]) => (
              <div key={key}>
                <div className="">
                  {key.toUpperCase()} : <span>{value || 'no data'}</span>
                </div>
              </div>
            ))}
          </div>
          <div className={customerAddressStyle}>
            <h4>Address Data</h4>
            {addresses.length ? (
              Object.entries(
                addresses.find((a) => a.id) || ({} as Address)
              ).map(([key, value]) => (
                <div key={key}>
                  <div className="">
                    {key.toUpperCase()} : <span>{value || 'no data'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div>No address data</div>
            )}
          </div>
        </div>
        <div className={customerBtnsContainer}>
          <button onClick={handleUpdateAccount}>Update Account Data</button>
          <button>Delete Account</button>
        </div>
      </div>
    );
  }
  return <div></div>;
}

export default MyCustomer;
