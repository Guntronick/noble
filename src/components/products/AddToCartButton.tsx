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
    if (!selectedColor) {
       toast({
        title: "Select a color",
        description: "Please choose a color before adding to cart.",
        variant: "destructive",
      });
      return;
    }
    if (quantity <= 0) {
      toast({
        title: "Invalid quantity",
        description: "Please enter a quantity greater than zero.",
        variant: "destructive",
      });
      return;
    }
    // Logic to add to cart (e.g., update state, call API)
    console.log(`Added to cart: ${product.name}, Color: ${selectedColor}, Quantity: ${quantity}`);
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
        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
      </Button>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Item Added to Cart!</AlertDialogTitle>
            <AlertDialogDescription>
              You've successfully added {quantity} x "{product.name}" (Color: {selectedColor}) to your shopping cart.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Shopping</AlertDialogCancel>
            <AlertDialogAction onClick={() => console.log('Proceed to checkout')}>
              View Cart & Checkout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
