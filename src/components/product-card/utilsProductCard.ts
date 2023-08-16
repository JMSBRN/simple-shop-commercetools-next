import { PriceValue } from './interfacesProductCard';

function formatValue(value: PriceValue): string {
    const amountInDollars = value.centAmount / Math.pow(10, value.fractionDigits);
    const formattedAmount = amountInDollars.toFixed(value.fractionDigits);
  
    // Adding commas to the formatted amount
    const parts = formattedAmount.split('.');
  
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
    return parts.join('.');
  }

  export default formatValue;