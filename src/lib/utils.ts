export function convertToCroreAndLakh(amount: number) {
    if (amount >= 10000000) {
      // Convert to crores
      return "₹" + (amount / 10000000).toFixed(2) + " Cr";
    } else if (amount >= 100000) {
      // Convert to lakhs
      return "₹" + (amount / 100000).toFixed(2) + " L";
    } else {
      // Return as is if less than 1 lakh
      return "₹" + amount.toString();
    }
  }