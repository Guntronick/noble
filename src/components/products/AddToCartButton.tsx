
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
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link" | null | undefined;
  className?: string;
}

export function AddToCartButton({ product, selectedColor, quantity, variant = "secondary", className }: AddToCartButtonProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!selectedColor && product.colors.length > 0) {
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
    // Simulate adding to cart
    console.log(`Añadido al carrito: ${product.name}, Color: ${selectedColor || 'N/A'}, Cantidad: ${quantity}`);
    toast({
      title: "¡Artículo Añadido!",
      description: `${quantity} x "${product.name}" ${product.colors.length > 0 && selectedColor ? `(Color: ${selectedColor})` : ''} fue añadido a tu carrito.`,
    });
    // setIsAlertOpen(true); // Using toast instead of alert dialog for now
  };

  return (
    <>
      <Button 
        onClick={handleAddToCart} 
        size="lg" 
        variant={variant === "default" ? "default" : variant} // Ensure "default" is mapped correctly or use another variant
        className={`w-full flex items-center gap-2 text-base py-3 ${className || (variant === "secondary" ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : "bg-olive-green text-primary-foreground hover:bg-olive-green/90")}`}
        disabled={product.stock <= 0}
      >
        <ShoppingCart className="h-5 w-5" />
        {product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
      </Button>

      {/* Alert Dialog can be re-enabled if preferred over toast for cart confirmation */}
      {/* <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¡Artículo Añadido al Carrito!</AlertDialogTitle>
            <AlertDialogDescription>
              Has añadido {quantity} x "{product.name}" {product.colors.length > 0 && selectedColor ? `(Color: ${selectedColor})` : ''} a tu carrito de compras.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Seguir Comprando</AlertDialogCancel>
            <AlertDialogAction onClick={() => console.log('Ir al carrito')}>
              Ver Carrito y Pagar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </>
  );
}
