
"use client";

import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import type { Product, CartItemBase } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AddToCartButtonProps {
  product: Product;
  selectedColor: string;
  quantity: number; // This quantity can be unvalidated from ProductDetailPage state
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link" | null | undefined;
  className?: string;
}

export function AddToCartButton({ product, selectedColor, quantity: rawQuantity, variant = "secondary", className }: AddToCartButtonProps) {
  const { toast } = useToast();

  const getValidatedQuantity = (currentQty: number): number => {
    if (!product) return 1; 
    let newQuantity = currentQty;
    if (typeof newQuantity !== 'number' || isNaN(newQuantity) || newQuantity <= 0) {
      newQuantity = 1;
    } else if (product.stock > 0 && newQuantity > product.stock) {
      newQuantity = product.stock;
    }
    return newQuantity;
  };

  const handleAddToCart = () => {
    if (typeof window === 'undefined' || !product) return;

    const currentQuantity = getValidatedQuantity(rawQuantity);

    if (!selectedColor && product.colors.length > 0) {
       toast({
        title: "Selecciona un color",
        description: "Por favor, elige un color antes de añadir al carrito.",
        variant: "destructive",
      });
      return;
    }
    
    // currentQuantity is already validated by getValidatedQuantity
    if (currentQuantity <= 0) { // Defensive check
      toast({
        title: "Cantidad inválida",
        description: "Por favor, introduce una cantidad mayor que cero.",
        variant: "destructive",
      });
      return;
    }

    const storedCart = localStorage.getItem('aiMerchCart');
    let cart: CartItemBase[] = storedCart ? JSON.parse(storedCart) : [];

    const existingItemIndex = cart.findIndex(item => item.id === product.id && item.selectedColor === (product.colors.length > 0 ? selectedColor : undefined));

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      const newTotalQuantity = cart[existingItemIndex].quantityInCart + currentQuantity;
      cart[existingItemIndex].quantityInCart = Math.min(newTotalQuantity, product.stock); // Respect stock
    } else {
      // Add new item
      const newItem: CartItemBase = {
        id: product.id,
        name: product.name,
        description: product.description,
        images: product.images,
        price: product.price,
        selectedColor: product.colors.length > 0 ? selectedColor : undefined,
        category: product.category,
        productCode: product.productCode,
        slug: product.slug,
        stock: product.stock,
        quantityInCart: Math.min(currentQuantity, product.stock), // currentQuantity already respects stock, but Math.min is safe
        dataAiHint: product.dataAiHint,
      };
      cart.push(newItem);
    }

    localStorage.setItem('aiMerchCart', JSON.stringify(cart));

    toast({
      title: "¡Artículo Añadido!",
      description: `${currentQuantity} x "${product.name}" ${product.colors.length > 0 && selectedColor ? `(Color: ${selectedColor})` : ''} fue añadido a tu carrito.`,
    });
  };

  return (
    <Button 
      onClick={handleAddToCart} 
      size="lg" 
      variant={variant}
      className={`w-full flex items-center gap-2 text-base py-3 ${className || ''}`}
      disabled={product.stock <= 0}
    >
      <ShoppingCart className="h-5 w-5" />
      {product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
    </Button>
  );
}
