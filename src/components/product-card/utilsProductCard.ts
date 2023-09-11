import { PriceValue } from './interfacesProductCard';

    function formatValue(value: PriceValue): string {
    const amountInDollars = value.centAmount / Math.pow(10, value.fractionDigits);
    const formattedAmount = amountInDollars.toFixed(value.fractionDigits);
  
    // Adding commas to the formatted amount
    const parts = formattedAmount.split('.');
  
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
    return parts.join('.');
  }

    function getPriceValue(value: PriceValue): number {
    return value.centAmount / Math.pow(10, value.fractionDigits);
  }

    function setDynamicArray (items: number) {
    const arr = [];

    for(var i=1; i<=items; i++) {
       arr.push(i);
    }
    return arr;
  };

    const setTotalPriceWithComma = (quantity: number, price: PriceValue) => {
     if(quantity === 1) {
      return formatValue(price);
     }
     return (quantity * getPriceValue(price)).toFixed(2);
  };

  export {
    formatValue,
    getPriceValue,
    setDynamicArray,
    setTotalPriceWithComma
  };