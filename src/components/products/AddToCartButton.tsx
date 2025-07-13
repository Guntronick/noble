
"use client";

import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowDown, CheckCircle, X } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const LOCAL_STORAGE_CART_KEY = 'nobleCart';

// This will be the new, simpler structure for localStorage
type StoredCartItem = {
  id: string;
  selectedColor?: string;
  quantityInCart: number;
};

interface AddToCartButtonProps {
  product: Product;
  selectedColor: string;
  quantity: number;
  className?: string;
}

export function AddToCartButton({ product, selectedColor, quantity: rawQuantityFromProp, className }: AddToCartButtonProps) {
  const { toast, dismiss } = useToast();

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

    const userOriginalQuantity = rawQuantityFromProp;
    const validatedQuantityForAction = getValidatedQuantity(userOriginalQuantity);

    if (!selectedColor && product.colors.length > 0) {
       toast({
        title: "Selecciona un color",
        description: "Por favor, elige un color antes de añadir al carrito.",
        variant: "destructive",
      });
      return;
    }

    if (userOriginalQuantity !== validatedQuantityForAction) {
      if (userOriginalQuantity === 0 && validatedQuantityForAction === 1) {
        toast({
          title: "Cantidad ajustada",
          description: `Se añadió ${validatedQuantityForAction} unidad al carrito. El mínimo es 1.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Cantidad ajustada",
          description: `La cantidad se procesó como ${validatedQuantityForAction} para el carrito debido a disponibilidad o mínimo requerido.`,
          variant: "default",
        });
      }
    }

    if (validatedQuantityForAction <= 0) {
      toast({
        title: "Cantidad inválida",
        description: "Por favor, introduce una cantidad mayor que cero.",
        variant: "destructive",
      });
      return;
    }

    const storedCartJson = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
    let cart: StoredCartItem[] = storedCartJson ? JSON.parse(storedCartJson) : [];

    const existingItemIndex = cart.findIndex(item => item.id === product.id && item.selectedColor === (product.colors.length > 0 ? selectedColor : undefined));

    if (existingItemIndex > -1) {
      const newTotalQuantity = cart[existingItemIndex].quantityInCart + validatedQuantityForAction;
      cart[existingItemIndex].quantityInCart = Math.min(newTotalQuantity, product.stock);
    } else {
      const newItem: StoredCartItem = {
        id: product.id,
        selectedColor: product.colors.length > 0 ? selectedColor : undefined,
        quantityInCart: Math.min(validatedQuantityForAction, product.stock),
      };
      cart.push(newItem);
    }

    localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));

    toast({
      variant: 'success',
      duration: 5000,
      description: (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-success-foreground" />
                <div className="flex flex-col">
                  <p className="font-semibold text-success-foreground">¡Agregado al Carrito!</p>
                  <p className="text-sm text-success-foreground/90">
                    {product.name}
                  </p>
                </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-2">
                <Button variant="outline" size="sm" asChild onClick={() => dismiss()}>
                    <Link href="/cart">Ver carrito</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => dismiss()} className="hover:bg-white/20">
                    Seguir navegando
                </Button>
            </div>
        </div>
      )
    });
  };

  return (
    <Button
      onClick={handleAddToCart}
      size="lg"
      variant="success"
      className={cn(
        "w-full flex items-center justify-center gap-2 text-base py-3 group",
        className
      )}
      disabled={product.stock <= 0}
    >
      <span className="relative inline-flex items-center justify-center h-6 w-6">
        <ShoppingCart
          className="h-full w-full"
        />
        <ArrowDown
          className={cn(
            "absolute h-4 w-4 opacity-0 transition-all duration-300 ease-in-out transform",
            "-translate-y-2 scale-75",
            "group-hover:opacity-100 group-hover:translate-y-0.5 group-hover:scale-100"
          )}
        />
      </span>
      <span>
        {product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
      </span>
    </Button>
  );
}
