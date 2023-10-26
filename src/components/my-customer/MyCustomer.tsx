import { CustomerInfo, UserData } from '@/interfaces';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  deleteAllCookiesFromLocal,
  setEncryptedDataToCookie,
} from '@/commercetools/utils/secureCookiesUtils';
import {
  deleteAllMyCarts,
  deleteAllMyOrders,
  getMyDetails,
  updateMyDetails,
} from '@/commercetools/utils/utilsMe';
import {
  deleteCustomer,
  getCustomers,
} from '@/commercetools/utils/utilsCustomers';
import { Address } from 'cluster';
import { ClientResponse } from '@commercetools/sdk-client-v2';
import { Customer } from '@commercetools/platform-sdk';
import InputField from '../forms/input-field/InputField';
import { setUserName } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './MyCustomer.module.scss';
import { useAppDispatch } from '@/hooks/storeHooks';
import { useRouter } from 'next/router';

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
  const dispatch = useAppDispatch();
  const { push } = useRouter();

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
        setFormData(formDataObject as CustomerInfo);

        const { body } = (await getCustomers(
          customer.id
        )) as ClientResponse<Customer>;
        const { version } = body!;

        const res = await updateMyDetails(email, password, formData, version);

        if (res?.statusCode === 200) {
          setIsAddresFormRendered(false);
          fetchMyDetails();
          const newUserData: UserData = {
            firstName: formData.firstName,
            email,
            password,
          };

          dispatch(setUserName(formData.firstName!));
          setEncryptedDataToCookie('userData', newUserData);
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
    const handleUpdateAccount = async () => {
      setIsAddresFormRendered(true);
    };
    const handleDeleteAccount = async () => {

      if (customer.id) {
        const isAllCartsRemoved = await deleteAllMyCarts(
          email,
          password,
          customer.id
        );
        const isAllOrdersRemoved = await deleteAllMyOrders(
          email,
          password,
          customer.id
        );

        if (isAllCartsRemoved && isAllOrdersRemoved) {
          const res = await deleteCustomer(customer.id);

          if(res?.id) {
            dispatch(setUserName(''));
            deleteAllCookiesFromLocal(['currentCartId', 'userData']);
            setIsAddresFormRendered(true);
            push('/');

          }
        }
      }
    };

    return (
      <div className={customerContainer}>
        {isAddresFormRendered && (
          <div className={updateUserInfoModal}>
            <form ref={formRef} onSubmit={handleSubmit}>
              {Object.entries(customerInfo).map(([key, value]) => (
                <label key={key}>
                  {key === 'dateOfBirth'
                    ? renderInputField(key, 'date', value, true)
                    : ['firstName', 'companyName'].includes(key)
                    ? renderInputField(key, undefined, value, true)
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
                <div>
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
                  <div>
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
          <button onClick={handleDeleteAccount}>Delete Account</button>
        </div>
      </div>
    );
  }
  return <div></div>;
}

export default MyCustomer;
