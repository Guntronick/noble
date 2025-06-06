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

export interface CartItem extends Product {
  quantity: number;
  selectedColor: string;
}
