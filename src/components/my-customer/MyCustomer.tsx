import React, { useEffect, useState } from 'react';
import { Address } from 'cluster';
import { Customer } from '@commercetools/platform-sdk';
import { CustomerInfo } from '@/interfaces';
import InputField from '../forms/input-field/InputField';
import { getMyDetails } from '@/commercetools/utils/utilsMe';
import styles from './MyCustomer.module.scss';

function MyCustomer({ email, password }: { email: string; password: string }) {
  const {
    customerContainer,
    customerInfoContainer,
    customerInfoStyle,
    customerAddressStyle,
    customerBtnsContainer,
  } = styles;
  const [customer, setCustomer] = useState<Customer>({} as Customer);
  // const [isAddresFormRendered, setIsAddresFormRendered] =
  //   useState<boolean>(false);
  const [formData, setFormData] = useState<CustomerInfo>({} as CustomerInfo);

  useEffect(() => {
    const fn = async () => {
      if(email && password) {
        const res = await getMyDetails(email, password);
  
        if (res.statusCode === 200) {
          setCustomer(res.body);
        }
      }
    };

    fn();
  }, [email, password]);

  if (customer.id) {
    const {
      salutation,
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      email,
      companyName,
      addresses,
    } = customer;
    const customerInfo: CustomerInfo = {
      salutation,
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      email,
      companyName,
    };
    const handeSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
      const value = e.target;

       console.log(value);
       
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
      fieldType?: string
    ) => {
      return (
        <InputField
          fieldName={fieldName}
          fieldType={fieldType}
          formData={formData}
          handleChange={handleChange}
        />
      );
    };

    return (
      <div className={customerContainer}>
        {false && (
          <div >
            <form onSubmit={handeSubmit}>
              {Object.keys(customerInfo).map((k) => (
                <div key={k}>
                  {renderInputField(k)}
                </div>
              ))}
              <input type="submit"/>
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
          <button>Update Account Data</button>
          <button>Delete Account</button>
        </div>
      </div>
    );
  }
  return <div></div>;
}

export default MyCustomer;
