import React from 'react';
import { useRouter } from 'next/router';

function NoProductPage() {
  const { back } = useRouter();

  return (
    <div>
      <div
        onClick={() => {
          back();
        }}
        style={{ cursor: 'pointer', color: 'blue', marginBottom: '30px' }}
      >
        Back Page
      </div>
      Sorry, in this time no products in this category.
    </div>
  );
}

export default NoProductPage;
