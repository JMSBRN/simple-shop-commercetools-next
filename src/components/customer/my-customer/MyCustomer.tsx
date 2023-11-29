import { CustomerInfo, UserData } from '@/interfaces';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getMyDetails, updateMyDetails } from '@/commercetools/utils/utilsMe';
import {
  selectCommerceTools,
  setUserName,
} from '@/features/commerceTools/CommerceToolsSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import ButtonWithLoader from '../../buttons/buttonWithLoader/ButtonWithLoader';
import { ClientResponse } from '@commercetools/sdk-client-v2';
import ConfirmForm from '../../forms/confirm-form/ConfirmForm';
import { Customer } from '@commercetools/platform-sdk';
import CustomerInfoDisplay from '../customer-info-display/CustomerInfoDisplay';
import UpdateUserDataForm from '../../forms/update-user-data-form/UpdateUserDataForm';
import { getCustomers } from '@/commercetools/utils/utilsCustomers';
import { isErrorResponse } from '@/commercetools/utils/utilsApp';
import { setEncryptedDataToCookie } from '@/commercetools/utils/secureCookiesUtils';
import styles from './MyCustomer.module.scss';
import useSubmitConfirmForm from '@/hooks/commercetools-hooks/useSubmitConfirmForm';
import { useTranslation } from 'next-i18next';

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
  const formRef = useRef<HTMLFormElement>(null);
  const confirmFormRef = useRef<HTMLFormElement>(null);
  const refSubmitInput = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const { errorMessage } = useAppSelector(selectCommerceTools);
  const { t: tForm } = useTranslation('form');
  const { t: tCommon } = useTranslation('common');
  const { confirmFormData, setConfirmFormData, handleSubmitConfirmFormData } =
    useSubmitConfirmForm({
      confirmFormRef,
      customerId: customer.id,
      email,
      password,
      setIsAddresFormRendered,
      setIsLoading,
    });

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

        const result = (await getCustomers(
          customer.id
        )) as ClientResponse<Customer>;

        if (!isErrorResponse(result)) {
          const { version } = result.body!;

          if (formDataObject.firstName) {
            const res = await updateMyDetails(
              email,
              password,
              formDataObject,
              version
            );

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
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    const handleUpdateAccount = async () => {
      setIsAddresFormRendered(true);
    };
    const handleDeleteAccount = async () => {
      setIsWarningDelModalRendered(true);
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

    return (
      <div className={customerContainer}>
        {isAddresFormRendered && (
          <div className={updateUserInfoModal}>
            <UpdateUserDataForm
              customerInfo={customerInfo}
              formData={formData}
              formRef={formRef}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              refSubmitInput={refSubmitInput}
            />
          </div>
        )}
        <div className={customerInfoContainer}>
          <div className={customerInfoStyle}>
            <h4>{tCommon('customerInformation')}</h4>
            <CustomerInfoDisplay customerInfo={customerInfo} t={tForm} />
          </div>
          <div className={customerAddressStyle}>
            <h4>{tCommon('addressData')}</h4>
            {addresses.length ? (
              <CustomerInfoDisplay
               customerInfo={addresses.find((a) => a.id)!}
               t={tForm}
              />
            ) : (
              <div>{tCommon('noAddressData')}</div>
            )}
          </div>
        </div>
        <div className={customerBtnsContainer}>
          <ButtonWithLoader
            onClick={handleUpdateAccount}
            text={tCommon('updateAccountData')}
          />
          <ButtonWithLoader
            onClick={handleDeleteAccount}
            text={tCommon('deleteAccount')}
          />
        </div>
        {isWarningDelModalRendered && (
          <div className={deleteWarningModalStyle}>
            <h4>{tCommon('confirmDeleteProcess')}</h4>
            <ConfirmForm
              formRef={confirmFormRef}
              formData={confirmFormData}
              onSubmit={handleSubmitConfirmFormData}
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
