
export interface ProductImageStructure {
  default: string[];
  [color: string]: string[]; // Allows for color-specific image arrays
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: ProductImageStructure; // Updated structure
  price: number;
  colors: string[];
  category: string;
  productCode: string;
  slug: string;
  stock: number;
  dataAiHint?: string;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  slug: string;
  dataAiHint?: string;
}

export interface CartItemBase {
  id: string;
  name: string;
  description: string;
  images: string[]; // Will store default images for cart display
  price: number;
  selectedColor?: string;
  category: string;
  productCode: string;
  slug: string;
  stock: number;
  quantityInCart: number;
  dataAiHint?: string;
}

export interface CartItemType extends CartItemBase {
  isRemoving?: boolean;
}
