import React, { useEffect, useState } from 'react';
import { Cart } from '@commercetools/platform-sdk';
import CustomerCart from '@/components/cart/CustomerCart';
import { getCarts } from '@/commercetools/utils/utilsCarts';
import { useRouter } from 'next/router';

function CustomerCartPage() {
 
     const [cart, setCart] = useState<Cart>({} as Cart);

      const { lineItems } = cart;
      const { id } = useRouter().query;

      useEffect(() => {
        const fn = async () => {
          const res = await getCarts(id as string) as Cart;

            if(res.id) {
               setCart(res);

            }          
        };

        fn();

      }, [id, lineItems]);
   
   return <CustomerCart cart={cart} />;
};

export default CustomerCartPage;
