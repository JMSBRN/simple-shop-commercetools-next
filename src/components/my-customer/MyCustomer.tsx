import { CustomerInfo, UserData } from '@/interfaces';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  areAllObjectValuesEqual,
  isErrorResponse,
} from '@/commercetools/utils/utilsApp';
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
import {
  selectCommerceTools,
  setErrorMessage,
  setUserName,
} from '@/features/commerceTools/CommerceToolsSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { Address } from 'cluster';
import ButtonWithLoader from '@/commercetools/buttons/buttonWithLoader/ButtonWithLoader';
import { ClientResponse } from '@commercetools/sdk-client-v2';
import ConfirmForm from '../forms/confirm-form/ConfirmForm';
import { Customer } from '@commercetools/platform-sdk';
import InputField from '../forms/input-field/InputField';
import styles from './MyCustomer.module.scss';
import { useRouter } from 'next/router';

function MyCustomer({ email, password }: { email: string; password: string }) {
  const {
    customerContainer,
    customerInfoContainer,
    customerInfoStyle,
    customerAddressStyle,
    customerBtnsContainer,
    updateUserInfoModal,
    deleteWarningModalStyle,
  } = styles;
  const [customer, setCustomer] = useState<Customer>({} as Customer);
  const [isAddresFormRendered, setIsAddresFormRendered] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWarningDelModalRendered, setIsWarningDelModalRendered] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<CustomerInfo>({} as CustomerInfo);
  const [confirmFormData, setConfirmFormData] = useState<any>({} as any);
  const formRef = useRef<HTMLFormElement>(null);
  const confirmFormRef = useRef<HTMLFormElement>(null);
  const refSubmitInput = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const { errorMessage } = useAppSelector(selectCommerceTools);
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
      setIsLoading(true);
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

        const result = (await getCustomers(
          customer.id
        )) as ClientResponse<Customer>;

        if (!isErrorResponse(result)) {
          const { version } = result.body!;

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
            setIsLoading(false);
          }
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
      setIsWarningDelModalRendered(true);
    };

    const handleSubmitForm = async () => {
      refSubmitInput.current?.onsubmit;
    };

    const handleChangeConfirmForm = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const { name, value } = e.target;

      setConfirmFormData((prevData: any) => ({
        ...prevData,
        [name]: value,
      }));
    };
    const handleSubmitCurrentFormData = async (
      e: React.ChangeEvent<HTMLFormElement>
    ) => {
      e.preventDefault();
      setIsLoading(true);
      if (confirmFormRef.current) {
        const formDataObject: Record<string, any> = {};

        const formElements = Array.from(
          confirmFormRef.current.elements
        ) as HTMLInputElement[];

        formElements.forEach((element) => {
          if (element.name) {
            formDataObject[element.name] = element.value;
          }
        });
        setConfirmFormData(formDataObject);
      }
      const isAllPasswordFieldsEquall = areAllObjectValuesEqual({
        ...confirmFormData,
        existedPassword: password,
      });

      if (isAllPasswordFieldsEquall) {
        dispatch(setErrorMessage(''));
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

            if (res?.id) {
              dispatch(setUserName(''));
              deleteAllCookiesFromLocal(['currentCartId', 'userData']);
              setIsAddresFormRendered(true);
              setIsLoading(false);
              push('/');
            }
          }
        }
      } else {
        dispatch(setErrorMessage('The password confirmation does not match'));
        setIsLoading(false);
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
              <ButtonWithLoader
                onClick={handleSubmitForm}
                text="submit"
                isLoading={isLoading}
              />
              <input
                ref={refSubmitInput}
                type="submit"
                style={{ display: 'none' }}
              />
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
          <ButtonWithLoader
            onClick={handleUpdateAccount}
            text="Update Account Data"
          />
          <ButtonWithLoader
            onClick={handleDeleteAccount}
            text="Delete Account"
          />
        </div>
        {isWarningDelModalRendered && (
          <div className={deleteWarningModalStyle}>
            <h4>Please confirm delete process</h4>
            <ConfirmForm
              formRef={confirmFormRef}
              formData={confirmFormData}
              onSubmit={handleSubmitCurrentFormData}
              handleChange={handleChangeConfirmForm}
              errorMessage={errorMessage}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    );
  }
  return <div></div>;
}

export default MyCustomer;
