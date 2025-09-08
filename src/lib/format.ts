export function formatPriceSom(value: number) {
  return new Intl.NumberFormat("ru-KG", {
    style: "currency",
    currency: "KGS",
    maximumFractionDigits: 0,
  }).format(value);
}

export function avg(numbers: number[]) {
  if (!numbers.length) return 0;
  return Math.round(numbers.reduce((a, b) => a + b, 0) / numbers.length);
}
