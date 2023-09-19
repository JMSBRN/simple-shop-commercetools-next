import React, { useEffect, useState } from 'react';
import { Cart } from '@commercetools/platform-sdk';
import CustomerCart from '@/components/cart/CustomerCart';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import { useAppSelector } from '@/hooks/storeHooks';
import { useRouter } from 'next/router';

function CustomerCartPage() {
  const { query } = useRouter();
  const { carts } = useAppSelector(selectCommerceTools);
  const cartId = query.id as string;
  const [cart, setCart] = useState<Cart>();

  useEffect(() => {
    setCart(carts.find(el => el.id === cartId) as Cart);
  }, [cartId, carts]);

   if(cart?.id) {
     return <CustomerCart cart={cart}/>;
   }
   return <div></div>;
};

export default CustomerCartPage;