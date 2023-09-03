import  {
  createShoppingListWithProductId,
  updateQuantityInShoppingList,
} from '@/commercetools/utils/utilsShoppingList';
import React from 'react';

function AddToCard({
  productId,
  quantity,
}: {
  productId: string;
  quantity: number;
}) {
  const handleCreaateCard = async () => {
    if (quantity) {
      const shoppingList = await createShoppingListWithProductId(
        { en: 'my list' },
        productId,
        quantity
      );

      if (shoppingList) {
        const { id, version, lineItems } = shoppingList;
        const lineItemId = lineItems[0].id;

        const res = await updateQuantityInShoppingList(id, version, lineItemId, quantity );

        console.log(res.statusCode);
      };
    }
  };

  return (
    <div>
      <div className="counter">count</div>
      <button type="button" onClick={handleCreaateCard}>
        add to cart
      </button>
    </div>
  );
}

export default AddToCard;
