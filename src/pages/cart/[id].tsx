import { Cart } from '@commercetools/platform-sdk';
import CustomerCart from '@/components/cart/CustomerCart';
import { GetServerSideProps } from 'next';
import React from 'react';
import { getCarts } from '@/commercetools/utils/utilsCarts';

function CustomerCartPage({ cart }: { cart: Cart }) {
  return <CustomerCart cart={cart} />;
};

export default CustomerCartPage;

export const getServerSideProps: GetServerSideProps = async ( { params }) => {
  const cart = await getCarts(params?.id as string);

  return {
    props: {
      cart
    }
  };
};