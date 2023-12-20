import React, { useEffect, useState } from 'react';
import { ClientResponse } from '@commercetools/sdk-client-v2';
import { Payment } from '@commercetools/platform-sdk';
import { getPayments } from '@/commercetools/utils/utilsPayment';
import { removeUnderscores } from '@/commercetools/utils/utilsApp';

function PaymentInfo({ paymentId }: { paymentId: string }) {
  const [payment, setPayment] = useState<Payment>({} as Payment);

  useEffect(() => {
    const fn = async () => {
      if (paymentId) {
        const { body } = (await getPayments(
          paymentId
        )) as ClientResponse<Payment>;

        if (body?.id) setPayment(body);
      }
    };

    fn();
  }, [paymentId]);

  return (
    <div>
      {payment.id && (
        <div>
          Payment method :{' '}
          {removeUnderscores(payment.paymentMethodInfo.method!)}
        </div>
      )}
    </div>
  );
}

export default PaymentInfo;
