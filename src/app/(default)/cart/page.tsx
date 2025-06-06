
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
import { X as XIcon, Minus, Plus } from 'lucide-react';

interface CartItem extends Product {
  quantityInCart: number;
  selectedColorInCart?: string;
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


  useEffect(() => {
    setCartItems(mockCartItems);
  }, []);

  useEffect(() => {
    return () => {
      if (removedProductToastTimeoutRef.current) {
        clearTimeout(removedProductToastTimeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantityInCart: Math.max(1, newQuantity) } : item
      ).filter(item => item.quantityInCart > 0) 
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    setShowRemovedProductToast(true);
    if (removedProductToastTimeoutRef.current) {
      clearTimeout(removedProductToastTimeoutRef.current);
    }
    removedProductToastTimeoutRef.current = setTimeout(() => {
      setShowRemovedProductToast(false);
    }, 3000);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantityInCart, 0);
  };

  const subtotal = calculateSubtotal();
  const total = subtotal; 

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Pedido/Presupuesto Enviado:", { formData, cartItems, total });
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
          <Card className="shadow-xl relative"> {/* Added position: relative here */}
            <CardHeader>
              <CardTitle className="text-2xl font-headline text-center">TU PEDIDO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {showRemovedProductToast && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-card border border-destructive text-destructive p-3 rounded-md shadow-lg z-10 flex items-center space-x-2 animate-pulse">
                  <span>Producto eliminado</span>
                  <XIcon size={18} className="text-destructive" />
                </div>
              )}
              <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>PRODUCTO</span>
                <span>SUBTOTAL</span>
              </div>
              <Separator />
              {cartItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Tu carrito está vacío.</p>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between space-x-2 py-3 border-b border-border last:border-b-0">
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
                                    handleQuantityChange(item.id, 1) // or set to 1 if you prefer
                                }
                            }}
                            onBlur={(e) => { // Ensure value is at least 1 on blur if empty or invalid
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
