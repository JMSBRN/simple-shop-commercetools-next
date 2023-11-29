import React, { useState } from 'react';
import {
  deleteAllMyCarts,
  deleteAllMyOrders,
} from '@/commercetools/utils/utilsMe';
import {
  setErrorMessage,
  setUserName,
} from '@/features/commerceTools/CommerceToolsSlice';
import { areAllObjectValuesEqual } from '@/commercetools/utils/utilsApp';
import { deleteAllCookiesFromLocal } from '@/commercetools/utils/secureCookiesUtils';
import { deleteCustomer } from '@/commercetools/utils/utilsCustomers';
import { useAppDispatch } from '../storeHooks';
import { useRouter } from 'next/router';

function useSubmitConfirmForm({
  confirmFormRef,
  setIsLoading,
  setIsAddresFormRendered,
  email, 
  password,
  customerId
}: {
  confirmFormRef: React.RefObject<HTMLFormElement>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAddresFormRendered: React.Dispatch<React.SetStateAction<boolean>>;
  email: string; 
  password: string;
  customerId: string;
}) {
    const dispatch = useAppDispatch();
    const { push } = useRouter();
    const [confirmFormData, setConfirmFormData] = useState<any>({} as any);

  const handleSubmitConfirmFormData = async (
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
      if (customerId) {
        const isAllCartsRemoved = await deleteAllMyCarts(
          email,
          password,
          customerId
        );
        const isAllOrdersRemoved = await deleteAllMyOrders(
          email,
          password,
          customerId
        );

        if (isAllCartsRemoved && isAllOrdersRemoved) {
          const res = await deleteCustomer(customerId);

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

  return {
    handleSubmitConfirmFormData,
    confirmFormData,
    setConfirmFormData
  };
}

export default useSubmitConfirmForm;
