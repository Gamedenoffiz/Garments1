// Product types and utilities for the e-commerce system
// All product data now comes from Supabase database

export interface ColorOption {
  name: string;
  color: string;
  isSelected?: boolean;
}

// Available colors that can be used in product variants
export const availableColors: ColorOption[] = [
  { name: "White", color: "#FFFFFF" },
  { name: "Black", color: "#000000" },
  { name: "Pink", color: "#FF69B4" },
  { name: "Lt-Green", color: "#90EE90" },
  { name: "Navy", color: "#000080" },
  { name: "Yellow", color: "#FFFF00" },
  { name: "Maroon", color: "#800000" },
  { name: "T-Blue", color: "#008B8B" },
  { name: "Tea Rose", color: "#F4C2C2" },
  { name: "Green", color: "#008000" },
  { name: "Lavender", color: "#E6E6FA" },
  { name: "Purple", color: "#800080" },
  { name: "Aqua", color: "#00FFFF" },
  { name: "Skin", color: "#FDBCB4" },
  { name: "Stone", color: "#918E85" },
  { name: "Orange", color: "#FFA500" },
  { name: "Wine", color: "#722F37" },
  { name: "Royal", color: "#4169E1" },
  { name: "Cream", color: "#FFFDD0" },
  { name: "Brown", color: "#A52A2A" },
  { name: "Red", color: "#FF0000" },
];

// Standard sizes available for products
export const standardSizes = ["XS", "S", "M", "L", "XL", "XXL"];

// Utility functions for product data
export const formatPrice = (price: number): string => {
  return `Rs. ${price.toLocaleString()}.00`;
};

export const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
  if (originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

export const getDiscountText = (originalPrice: number, currentPrice: number): string => {
  const discount = calculateDiscount(originalPrice, currentPrice);
  return discount > 0 ? `${discount}% OFF` : '';
};
