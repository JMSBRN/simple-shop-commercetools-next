import React, { useEffect, useState } from 'react';
import { Cart } from '@commercetools/platform-sdk';
import CustomerCart from '@/components/cart/customer-cart/CustomerCart';
import { GetServerSideProps } from 'next';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
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

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {

  return {
    props: {
      ...(await serverSideTranslations(locale || 'en-GB', ['translation', 'common'])),
    },
  };
};