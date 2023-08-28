
import React from 'react';
import { apiRoot } from '@/commercetools/BuildClient';

function AddToCard() {

  const handleCreaateCard = async () => {
    const res = await apiRoot
      .carts()
      .post({
        headers: { 'Content-Type': 'application/json' },
        body: {
          currency: 'EUR',
        }
      }).execute();

     console.log(res);
  };

  return (
    <div>
      <div className="counter">count</div>
      <button type="button" onClick={() => handleCreaateCard()}>
        get Card
      </button>
    </div>
  );
}

export default AddToCard;
