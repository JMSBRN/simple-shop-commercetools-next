import { ClientResponse, Payment, PaymentPagedQueryResponse } from '@commercetools/platform-sdk';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getPayments } from '@/commercetools/utils/utilsPayment';

export const fetchPayments = createAsyncThunk<Payment[]>(
    'payments/fetchPayments',
    async () => {
      try {
        const { body } = await getPayments() as  ClientResponse<PaymentPagedQueryResponse>;
        const { results  } = body;

        return results;
      } catch (error) {
        throw new Error(`Error fetching payments from commercetools: ${error}`);
      }
    }
  );
