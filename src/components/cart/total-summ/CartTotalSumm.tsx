import { useEffect, useState } from 'react';
import { Cart } from '@commercetools/platform-sdk';
import { getCurrencySymbol } from '@/commercetools/utils/utilsCommercTools';
import { getTotalSumFromCarts } from '@/commercetools/utils/utilsCarts';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import { useAppSelector } from '@/hooks/storeHooks';

function CartTotalSum({ carts }: { carts: Cart[] }) {
    const [totalSum, setTotalSum] = useState<string>('');
    const [currencySymbol, setCurrencySymbol] = useState<string>('');
    const { country } = useAppSelector(selectCommerceTools);
  
    useEffect(() => {
      const fn = async () => {
        if (carts.length) {
          const res = await getTotalSumFromCarts(carts, country);
  
          if (res) {
            setTotalSum(res.totalPrice);
            setCurrencySymbol(getCurrencySymbol(country, res.currencyCode!));
          }
        }
      };
  
      fn();
    }, [carts, country]);
    return (
      <div
        style={{ minWidth: '30px', width: 'auto', height: '20px' }}
      >{`${totalSum} ${currencySymbol}`}</div>
    );
  }
  export default CartTotalSum;
  