

export function formatMoney(value: string | number) {
     const priceFormat = parseFloat(String(value ?? '0'))?.toLocaleString(
      'pt-br',
      {
        style: 'currency',
        currency: 'brl',
      }
    );
    return priceFormat;
   
}