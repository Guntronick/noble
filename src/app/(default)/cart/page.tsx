
"use client";

import { useState, useEffect, useRef } from 'react';
import type { CartItemType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { X as XIcon, Minus, Plus, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEM_REMOVAL_ANIMATION_DURATION = 300; // ms for item sliding out
const TOAST_TIMER_DURATION = 1200; // ms for how long the toast is visible
const TOAST_ANIMATION_DURATION = 500; // ms for toast fade/scale animation

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    phone: '',
    email: '',
    orderNotes: '',
  });
  const [showRemovedProductToast, setShowRemovedProductToast] = useState(false);
  const removedProductToastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [removedProductToastKey, setRemovedProductToastKey] = useState(0); 
  
  const progressBarRef = useRef<HTMLDivElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCartItems = localStorage.getItem('aiMerchCart');
      if (storedCartItems) {
        try {
          const parsedItems: Omit<CartItemType, 'isRemoving'>[] = JSON.parse(storedCartItems);
          setCartItems(parsedItems.map(item => ({ ...item, isRemoving: false })));
        } catch (error) {
          console.error("Error parsing cart items from localStorage:", error);
          localStorage.removeItem('aiMerchCart'); // Clear corrupted data
        }
      }
      setIsCartLoaded(true); // Mark cart as loaded
    }
  }, []);

  // Save cart to localStorage whenever it changes, but only after initial load
  useEffect(() => {
    if (typeof window !== 'undefined' && isCartLoaded) {
      const itemsToStore = cartItems.map(({ isRemoving, ...rest }) => rest);
      localStorage.setItem('aiMerchCart', JSON.stringify(itemsToStore));
    }
  }, [cartItems, isCartLoaded]);


  useEffect(() => {
    return () => {
      if (removedProductToastTimeoutRef.current) {
        clearTimeout(removedProductToastTimeoutRef.current);
      }
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (showRemovedProductToast && progressBarRef.current) {
      let startTime: number | null = null;
      const barElement = progressBarRef.current;
      barElement.style.width = '100%'; // Reset width
      
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsedTime = timestamp - startTime;
        const progress = Math.max(0, (TOAST_TIMER_DURATION - elapsedTime) / TOAST_TIMER_DURATION);
        
        if (barElement) barElement.style.width = `${progress * 100}%`;

        if (elapsedTime < TOAST_TIMER_DURATION) {
          animationFrameIdRef.current = requestAnimationFrame(animate);
        } else {
          if (barElement) barElement.style.width = '0%';
        }
      };
      animationFrameIdRef.current = requestAnimationFrame(animate);
    } else if (progressBarRef.current) {
      progressBarRef.current.style.width = '100%'; 
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    }
    
    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [showRemovedProductToast, removedProductToastKey]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === productId) {
          const quantity = Math.max(1, Math.min(newQuantity, item.stock));
          return { ...item, quantityInCart: quantity };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (productId: string) => {
    const itemToRemove = cartItems.find(item => item.id === productId);
    if (!itemToRemove) return;

    setCartItems(prevItems =>
      prevItems.map(it =>
        it.id === productId ? { ...it, isRemoving: true } : it
      )
    );

    setTimeout(() => {
      setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
      setShowRemovedProductToast(true);
      setRemovedProductToastKey(prevKey => prevKey + 1); 

      if (removedProductToastTimeoutRef.current) {
        clearTimeout(removedProductToastTimeoutRef.current);
      }
      removedProductToastTimeoutRef.current = setTimeout(() => {
        setShowRemovedProductToast(false);
      }, TOAST_TIMER_DURATION + TOAST_ANIMATION_DURATION);
    }, ITEM_REMOVAL_ANIMATION_DURATION);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantityInCart, 0);
  };

  const subtotal = calculateSubtotal();
  const total = subtotal;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderItems = cartItems.filter(item => !item.isRemoving).map(({ isRemoving, ...rest}) => rest);
    console.log("Pedido/Presupuesto Enviado:", { formData, cartItems: orderItems, total });
    alert("Pedido/Presupuesto enviado. Nos pondremos en contacto pronto.");
  };

  if (!isCartLoaded) {
    return <div className="container mx-auto px-4 py-12 text-center">Cargando carrito...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {showRemovedProductToast && (
        <div
          key={`toast-${removedProductToastKey}`}
          id="removed-product-toast"
          className={cn(
            "fixed right-8 w-auto min-w-[280px] max-w-sm bg-card border border-destructive p-4 rounded-lg shadow-xl z-[100] transition-all ease-in-out",
            showRemovedProductToast
              ? 'top-20 opacity-100 scale-100 pointer-events-auto'
              : 'top-20 opacity-0 scale-95 pointer-events-none'
          )}
          style={{ transitionDuration: `${TOAST_ANIMATION_DURATION}ms` }}
        >
          <div className="flex items-center space-x-3">
            <XCircle className="h-6 w-6 text-destructive shrink-0" />
            <span className="text-sm font-medium text-destructive">Producto eliminado</span>
          </div>
          <div className="mt-3 h-1.5 w-full bg-destructive/20 rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full bg-destructive"
            />
          </div>
        </div>
      )}
      <div className="mb-6">
        <p className="text-muted-foreground">
          ¿Tienes un cupón? <Link href="#" className="text-primary hover:underline">Haz clic aquí para introducir tu código</Link>
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-headline">DETALLES DE FACTURACIÓN</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Nombre <span className="text-destructive">*</span></Label>
                  <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="lastName">Apellidos <span className="text-destructive">*</span></Label>
                  <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                </div>
              </div>
              <div>
                <Label htmlFor="companyName">Nombre de la empresa (opcional)</Label>
                <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono <span className="text-destructive">*</span></Label>
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="email">Dirección de correo electrónico <span className="text-destructive">*</span></Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-headline">INFORMACIÓN ADICIONAL</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="orderNotes">Notas del pedido (opcional)</Label>
              <Textarea
                id="orderNotes"
                name="orderNotes"
                value={formData.orderNotes}
                onChange={handleInputChange}
                placeholder="Notas sobre tu pedido, por ejemplo, notas especiales para la entrega."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        <div className="sticky top-24 self-start space-y-6">
           <Card className="shadow-xl relative overflow-hidden">
            <CardHeader> {/* Reverted padding-top */}
              <CardTitle className="text-2xl font-headline text-center">TU PEDIDO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>PRODUCTO</span>
                <span>SUBTOTAL</span>
              </div>
              <Separator />
              {cartItems.filter(item => !item.isRemoving).length === 0 && !cartItems.some(item => item.isRemoving) ? (
                <p className="text-muted-foreground text-center py-4">Tu carrito está vacío.</p>
              ) : (
                cartItems.map(item => (
                  <div
                    key={`${item.id}-${item.selectedColor || 'no-color'}`}
                    className={cn(
                      "flex items-center justify-between space-x-2",
                      "py-3 border-b border-border last:border-b-0",
                      "transition-all ease-in-out overflow-hidden",
                      item.isRemoving
                        ? "max-h-0 opacity-0 -translate-x-full !py-0 !my-0 !border-opacity-0"
                        : "max-h-48 opacity-100 translate-x-0"
                    )}
                     style={{ transitionDuration: `${ITEM_REMOVAL_ANIMATION_DURATION}ms` }}
                  >
                    <div className="flex items-center space-x-3">
                       <Button
                         type="button"
                         variant="ghost"
                         size="icon"
                         className="text-destructive hover:text-destructive/80 p-1 h-7 w-7"
                         onClick={() => handleRemoveItem(item.id)}
                         aria-label="Eliminar producto"
                       >
                        <XIcon size={16} />
                      </Button>
                      <Link href={`/products/${item.slug}`}>
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="rounded-md object-cover aspect-square"
                          data-ai-hint={item.dataAiHint || "product image"}
                        />
                      </Link>
                      <div className="flex-grow">
                        <Link href={`/products/${item.slug}`} className="font-medium text-foreground hover:text-primary">{item.name}</Link>
                        {item.selectedColor && <p className="text-xs text-muted-foreground">- {item.selectedColor}</p>}
                        <div className="flex items-center mt-1">
                           <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 p-1"
                            onClick={() => handleQuantityChange(item.id, item.quantityInCart - 1)}
                            disabled={item.quantityInCart <= 1}
                          >
                            <Minus size={14} />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantityInCart}
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (!isNaN(val) && val >=1) {
                                     handleQuantityChange(item.id, val)
                                }
                            }}
                            onBlur={(e) => { 
                                if (item.quantityInCart < 1 || isNaN(item.quantityInCart)) {
                                   handleQuantityChange(item.id, 1);
                                }
                            }}
                            min="1"
                            max={item.stock}
                            className="w-14 h-7 text-center mx-1 hide-arrows [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            aria-label={`Cantidad de ${item.name}`}
                          />
                           <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 p-1"
                            onClick={() => handleQuantityChange(item.id, item.quantityInCart + 1)}
                            disabled={item.quantityInCart >= item.stock}
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <span className="font-medium text-foreground text-right min-w-[80px]">
                      ${(item.price * item.quantityInCart).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                ))
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-primary">
                <span>Total</span>
                <span>${total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <Separator />
              <div className="text-sm text-muted-foreground space-y-2 mt-4 p-3 bg-muted/50 rounded-md">
                <p className="font-semibold text-foreground">Solicitar Presupuesto</p>
                <p>No efectuaremos cargos de ningún tipo. En breve te enviaremos el presupuesto por los productos solicitados.</p>
              </div>
              <Button type="submit" size="lg" className="w-full bg-olive-green text-primary-foreground hover:bg-olive-green/90 mt-6 text-base py-3" disabled={cartItems.filter(item => !item.isRemoving).length === 0}>
                REALIZAR EL PEDIDO
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
