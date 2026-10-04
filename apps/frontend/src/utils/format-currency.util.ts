const currency = new Intl.NumberFormat("en-us", {
  currency: "php",
  style: "currency",
});
export const formatCurrency = (num: number): string => {
  return currency.format(num);
};
