
"use client";

import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowRight } from 'lucide-react'; // Import ArrowRight
import type { Product, CartItemBase } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const LOCAL_STORAGE_CART_KEY = 'nobleCart';

interface AddToCartButtonProps {
  product: Product;
  selectedColor: string;
  quantity: number;
  className?: string;
}

export function AddToCartButton({ product, selectedColor, quantity: rawQuantityFromProp, className }: AddToCartButtonProps) {
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
        images: product.images.default && product.images.default.length > 0 ? product.images.default : ['https://placehold.co/100x100.png'],
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
      variant="success"
      className={cn(
        "w-full flex items-center justify-center gap-2 text-base py-3 group", // Added group class
        className
      )}
      disabled={product.stock <= 0}
    >
      <span className="relative inline-flex items-center justify-center h-5 w-5"> {/* Container for icons */}
        <ShoppingCart
          className="h-full w-full" // ShoppingCart remains static
        />
        <ArrowRight
          className={cn(
            "absolute h-3 w-3 opacity-0 transition-all duration-300 ease-in-out",
            "transform translate-x-[-8px] scale-75", // Starts left, small, and invisible
            "group-hover:opacity-100 group-hover:translate-x-[1px] group-hover:scale-100" // On hover: visible, moves right, scales up
          )}
        />
      </span>
      <span>
        {product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
      </span>
    </Button>
  );
}

