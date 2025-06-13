
"use client";

import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import type { Product, CartItemBase } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const LOCAL_STORAGE_CART_KEY = 'nobleCart';

interface AddToCartButtonProps {
  product: Product;
  selectedColor: string;
  quantity: number; 
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link" | null | undefined;
  className?: string;
}

export function AddToCartButton({ product, selectedColor, quantity: rawQuantityFromProp, variant = "secondary", className }: AddToCartButtonProps) {
  const { toast } = useToast();

  const getValidatedQuantityForAction = (currentQty: number): number => {
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

    const userOriginalQuantity = rawQuantityFromProp; // This is the raw value from the input field state
    const validatedQuantityForAction = getValidatedQuantityForAction(userOriginalQuantity);

    if (!selectedColor && product.colors.length > 0) {
       toast({
        title: "Selecciona un color",
        description: "Por favor, elige un color antes de añadir al carrito.",
        variant: "destructive",
      });
      return;
    }
    
    if (userOriginalQuantity !== 0 && validatedQuantityForAction !== userOriginalQuantity) {
        toast({
          title: "Cantidad ajustada",
          description: `La cantidad se procesó como ${validatedQuantityForAction} para el carrito debido a disponibilidad o mínimo requerido.`,
          variant: "default",
        });
    } else if (userOriginalQuantity === 0 && validatedQuantityForAction === 1) {
         toast({
          title: "Cantidad ajustada",
          description: `Se añadió ${validatedQuantityForAction} unidad al carrito. El mínimo es 1.`,
          variant: "default",
        });
    }
    
    if (validatedQuantityForAction <= 0) { 
      // This case should ideally be covered by getValidatedQuantityForAction setting it to 1,
      // but as a safeguard:
      toast({
        title: "Cantidad inválida",
        description: "Por favor, introduce una cantidad mayor que cero.",
        variant: "destructive",
      });
      return;
    }

    const storedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
    let cart: CartItemBase[] = storedCart ? JSON.parse(storedCart) : [];

    const existingItemIndex = cart.findIndex(item => item.id === product.id && item.selectedColor === (product.colors.length > 0 ? selectedColor : undefined));

    if (existingItemIndex > -1) {
      const newTotalQuantity = cart[existingItemIndex].quantityInCart + validatedQuantityForAction;
      cart[existingItemIndex].quantityInCart = Math.min(newTotalQuantity, product.stock); 
    } else {
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
        quantityInCart: Math.min(validatedQuantityForAction, product.stock),
        dataAiHint: product.dataAiHint,
      };
      cart.push(newItem);
    }

    localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));

    toast({
      title: "¡Artículo Añadido!",
      description: `${validatedQuantityForAction} x "${product.name}" ${product.colors.length > 0 && selectedColor ? `(Color: ${selectedColor})` : ''} fue añadido a tu carrito.`,
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

