// --------------------------------------------------
// Format price
// --------------------------------------------------
export function formatPrice(price) {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return "Rs. 0.00";
  }

  return (
    "Rs. " +
    numericPrice.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

// --------------------------------------------------
// Alternative function name for older components
// --------------------------------------------------
export function getFormattedPrice(price) {
  return formatPrice(price);
}

export default formatPrice;