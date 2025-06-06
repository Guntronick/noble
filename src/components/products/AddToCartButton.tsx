"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AddToCartButtonProps {
  product: Product;
  selectedColor: string;
  quantity: number;
}

export function AddToCartButton({ product, selectedColor, quantity }: AddToCartButtonProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!selectedColor && product.colors.length > 0) { // Check if product has colors before requiring one
       toast({
        title: "Selecciona un color",
        description: "Por favor, elige un color antes de añadir al carrito.",
        variant: "destructive",
      });
      return;
    }
    if (quantity <= 0) {
      toast({
        title: "Cantidad inválida",
        description: "Por favor, introduce una cantidad mayor que cero.",
        variant: "destructive",
      });
      return;
    }
    console.log(`Añadido al carrito: ${product.name}, Color: ${selectedColor || 'N/A'}, Cantidad: ${quantity}`);
    setIsAlertOpen(true);
  };

  return (
    <>
      <Button 
        onClick={handleAddToCart} 
        size="lg" 
        className="w-full bg-olive-green text-primary-foreground hover:bg-olive-green/90 flex items-center gap-2"
        disabled={product.stock <= 0}
      >
        <ShoppingCart className="h-5 w-5" />
        {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
      </Button>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¡Artículo Añadido al Carrito!</AlertDialogTitle>
            <AlertDialogDescription>
              Has añadido {quantity} x "{product.name}" {product.colors.length > 0 ? `(Color: ${selectedColor})` : ''} a tu carrito de compras.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Seguir Comprando</AlertDialogCancel>
            <AlertDialogAction onClick={() => console.log('Ir al carrito')}>
              Ver Carrito y Pagar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
