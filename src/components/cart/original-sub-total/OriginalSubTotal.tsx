import { Cart } from '@commercetools/platform-sdk';
import { getCurrencySymbol } from '@/commercetools/utils/utilsCommercTools';
import { getOriginalSubTotal } from '@/commercetools/utils/utilsCarts';

export function OriginalTotal ({ cart }: { cart: Cart}) {
    const { taxedPrice, taxedShippingPrice } = cart;
    const fractionDigits = taxedPrice?.totalNet.fractionDigits!;
     const subTotalNumber = getOriginalSubTotal(taxedPrice!, taxedShippingPrice!);
     const amountInDollars = subTotalNumber / Math.pow(10, fractionDigits);
     const formattedAmount = amountInDollars.toFixed(fractionDigits);
     const parts = formattedAmount.split('.');
   
     parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
   
     const currencySymbol = getCurrencySymbol(cart.country!, taxedPrice?.totalGross.currencyCode!);
     const subTotal =  parts.join('.');
   
     return (
         <span>{`${subTotal} ${currencySymbol}`}</span>
     );
   }
