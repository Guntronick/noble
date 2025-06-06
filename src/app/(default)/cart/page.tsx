
"use client";

import { useState, useEffect, useRef } from 'react';
import type { Product } from '@/lib/types'; 
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

interface CartItem extends Product {
  quantityInCart: number;
  selectedColorInCart?: string;
  isRemoving?: boolean; // For animation
}

const mockCartItems: CartItem[] = [
  {
    id: 'prod_001',
    name: 'BOLSO / MOCHILA "SPIRIT" GATTI',
    description: 'Un bolso muy espacioso.',
    images: ['https://placehold.co/100x100.png'], 
    dataAiHint: "grey backpack",
    price: 19174.84, 
    colors: ['Gris'],
    selectedColorInCart: 'Gris',
    category: 'Accesorios',
    productCode: 'BG-001',
    slug: 'bolso-spirit-gatti',
    stock: 10,
    quantityInCart: 1,
  },
  {
    id: 'prod_002',
    name: 'AI-Designed Tee',
    description: 'Unique AI Tee.',
    images: ['https://placehold.co/100x100.png'],
    dataAiHint: "ai t-shirt",
    price: 29.99,
    colors: ['Black', 'White'],
    selectedColorInCart: 'Black',
    category: 'Apparel',
    productCode: 'AIMC-APP-001',
    slug: 'ai-designed-tee',
    stock: 50,
    quantityInCart: 2,
  },
];

const ITEM_REMOVAL_ANIMATION_DURATION = 300; // ms for item sliding out
const TOAST_TIMER_DURATION = 1200; // ms for how long the toast is visible
const TOAST_ANIMATION_DURATION = 300; // ms for toast fade/scale animation

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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
  const [removedProductToastKey, setRemovedProductToastKey] = useState(0); // Key for toast re-render
  const [progressWidth, setProgressWidth] = useState('100%');


  useEffect(() => {
    setCartItems(mockCartItems.map(item => ({ ...item })));
  }, []);

  useEffect(() => {
    return () => {
      if (removedProductToastTimeoutRef.current) {
        clearTimeout(removedProductToastTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (showRemovedProductToast) {
      setProgressWidth('100%'); 
      // Force reflow/repaint before starting transition to 0%
      const frameId = requestAnimationFrame(() => {
         setProgressWidth('0%'); 
      });
      return () => cancelAnimationFrame(frameId);
    }
  }, [showRemovedProductToast, removedProductToastKey]); // Depend on key change


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantityInCart: Math.max(1, newQuantity) } : item
      )
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
      setCartItems(prevItems => prevItems.filter(item => item.id !== productId && !item.isRemoving)); 
      
      setShowRemovedProductToast(true);
      setRemovedProductToastKey(prevKey => prevKey + 1); // Increment key to force re-render

      if (removedProductToastTimeoutRef.current) {
        clearTimeout(removedProductToastTimeoutRef.current);
      }
      removedProductToastTimeoutRef.current = setTimeout(() => {
        setShowRemovedProductToast(false);
      }, TOAST_TIMER_DURATION);
    }, ITEM_REMOVAL_ANIMATION_DURATION);
  };


  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantityInCart, 0);
  };

  const subtotal = calculateSubtotal();
  const total = subtotal; 

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual order submission logic (e.g., API call)
    console.log("Pedido/Presupuesto Enviado:", { formData, cartItems: cartItems.filter(item => !item.isRemoving), total });
    alert("Pedido/Presupuesto enviado. Nos pondremos en contacto pronto.");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <p className="text-muted-foreground">
          ¿Tienes un cupón? <Link href="#" className="text-primary hover:underline">Haz clic aquí para introducir tu código</Link>
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Billing Details Section */}
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

        {/* Order Summary Section */}
        <div className="sticky top-24 self-start space-y-6">
          <Card className="shadow-xl relative overflow-hidden"> {/* Added overflow-hidden */}
            <CardHeader className="pt-16"> {/* Increased padding-top to make space for the toast */}
              <CardTitle className="text-2xl font-headline text-center">TU PEDIDO</CardTitle>
            </CardHeader>
            {showRemovedProductToast && (
              <div
                key={`toast-${removedProductToastKey}`} // Use the key here
                id="removed-product-toast"
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 w-auto min-w-[280px] max-w-[90%] bg-card border border-destructive p-4 rounded-lg shadow-xl z-50 transition-all ease-in-out",
                  `duration-${TOAST_ANIMATION_DURATION}ms`, // Matched duration with TOAST_TIMER_DURATION for consistency
                  showRemovedProductToast // This will control initial visibility but animation is handled by Tailwind's data-state
                    ? 'top-4 opacity-100 scale-100 pointer-events-auto' // Appears
                    : 'top-4 opacity-0 scale-95 pointer-events-none' // Hides
                )}
              >
                <div className="flex items-center space-x-3">
                  <XCircle className="h-6 w-6 text-destructive shrink-0" />
                  <span className="text-sm font-medium text-destructive">Producto eliminado</span>
                </div>
                {/* Progress Bar */}
                <div className="mt-3 h-1.5 w-full bg-destructive/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-destructive transition-all ease-linear" // Tailwind handles animation
                    style={{ width: progressWidth, transitionDuration: `${TOAST_TIMER_DURATION}ms` }}
                  />
                </div>
              </div>
            )}
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>PRODUCTO</span>
                <span>SUBTOTAL</span>
              </div>
              <Separator />
              {cartItems.filter(item => !item.isRemoving || item.isRemoving).length === 0 && !cartItems.some(item => item.isRemoving) ? ( // Check if all items are removed or being removed
                <p className="text-muted-foreground text-center py-4">Tu carrito está vacío.</p>
              ) : (
                cartItems.map(item => (
                  <div 
                    key={item.id} 
                    className={cn(
                      "flex items-center justify-between space-x-2",
                      "py-3 border-b border-border last:border-b-0", // Add consistent bottom border, remove last one
                      "transition-all ease-in-out overflow-hidden", // Needed for height animation
                      `duration-${ITEM_REMOVAL_ANIMATION_DURATION}ms`, // Tailwind JIT should pick this up
                      item.isRemoving
                        ? "max-h-0 opacity-0 -translate-x-full !py-0 !my-0 !border-opacity-0" // Animate out: shrink, fade, slide
                        : "max-h-48 opacity-100 translate-x-0" // Animate in or normal state
                    )}
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
                        {item.selectedColorInCart && <p className="text-xs text-muted-foreground">- {item.selectedColorInCart}</p>}
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
                                if (val >=1) {
                                     handleQuantityChange(item.id, val)
                                } else if (e.target.value === '' || val < 1) {
                                    // Allow clearing, will be handled onBlur or if user types valid number next
                                }
                            }}
                            onBlur={(e) => { // Ensure quantity is at least 1 on blur if input is cleared or invalid
                                if (item.quantityInCart < 1 || isNaN(item.quantityInCart)) {
                                   handleQuantityChange(item.id, 1);
                                }
                            }}
                            min="1"
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
              
              <Button type="submit" size="lg" className="w-full bg-olive-green text-primary-foreground hover:bg-olive-green/90 mt-6 text-base py-3">
                REALIZAR EL PEDIDO
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}


    