import {
  addLineItemToCart,
  createCartWithProductId,
  getCurrentDataFromCart,
} from '@/commercetools/utils/utilsCarts';
import {
  getDecryptedDataFromCookie,
  setEncryptedDataToCookie,
} from '@/commercetools/utils/secureCookiesUtils';
import { useAppDispatch, useAppSelector } from '../storeHooks';
import { Cart } from '@commercetools/platform-sdk';
import { UserData } from '@/interfaces';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';

function useCreateCart({
    productId,
    selectedIdVariant,
    quantity,

}:{
    productId: string;
    selectedIdVariant: number;
    quantity: number;
}) {

  const userData = JSON.parse(getDecryptedDataFromCookie('userData')) as
    | UserData
    | undefined;

  const dispatch = useAppDispatch();
  const { country } = useAppSelector(selectCommerceTools);

  const handleCreateCard = async () => {
    const currentCartId = JSON.parse(
      getDecryptedDataFromCookie('currentCartId')
    ) as string | undefined;

    if (quantity && !currentCartId) {
      const resNewCart = await createCartWithProductId(
        country,
        productId,
        selectedIdVariant,
        quantity,
        userData?.customerId || undefined,
        userData?.customerId
      );
      const newCart = resNewCart?.body as Cart;

      if (newCart?.id) {
        setEncryptedDataToCookie('currentCartId', newCart.id, 3600);
        dispatch(fetchCarts());
      }
    }

    if (quantity && currentCartId) {
      const cart = await getCurrentDataFromCart(currentCartId);
      const { version } = cart!;

      await addLineItemToCart(
        currentCartId,
        version,
        productId,
        quantity,
        selectedIdVariant
      );
      dispatch(fetchCarts());
    }
  };

  return {
    handleCreateCard,
  };
}

export default useCreateCart;
