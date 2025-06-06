
export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[]; // URLs
  price: number;
  colors: string[];
  category: string;
  productCode: string;
  slug: string;
  stock: number;
  dataAiHint?: string; // Optional hint for main image
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  slug: string;
  dataAiHint?: string;
}

// Type for items stored in localStorage and used in cart state
// It does not include UI-specific properties like 'isRemoving'
export interface CartItemBase {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  selectedColor?: string;
  category: string;
  productCode: string;
  slug: string;
  stock: number;
  quantityInCart: number;
  dataAiHint?: string;
}

// Type used in the CartPage component's state, including UI properties
export interface CartItemType extends CartItemBase {
  isRemoving?: boolean;
}
