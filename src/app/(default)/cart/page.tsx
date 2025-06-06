
"use client";

import { useState, useEffect } from 'react';
import type { Product } from '@/lib/types'; // Assuming Product type might be useful
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { X as XIcon } from 'lucide-react'; // For the remove item icon

interface CartItem extends Product { // Simplified for example
  quantityInCart: number;
  selectedColorInCart?: string;
}

const mockCartItems: CartItem[] = [
  {
    id: 'prod_001',
    name: 'BOLSO / MOCHILA "SPIRIT" GATTI',
    description: 'Un bolso muy espacioso.',
    images: ['https://placehold.co/100x100.png'], // Placeholder image
    dataAiHint: "grey backpack",
    price: 19174.84, // Example price
    colors: ['Gris'],
    selectedColorInCart: 'Gris',
    category: 'Accesorios',
    productCode: 'BG-001',
    slug: 'bolso-spirit-gatti',
    stock: 10,
    quantityInCart: 2000,
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

  useEffect(() => {
    // In a real app, you'd fetch cart items from context, localStorage, or an API
    setCartItems(mockCartItems);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantityInCart, 0);
  };

  const subtotal = calculateSubtotal();
  const total = subtotal; // Assuming no taxes or shipping for now

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to submit the order/quote request
    console.log("Pedido/Presupuesto Enviado:", { formData, cartItems, total });
    alert("Pedido/Presupuesto enviado. Nos pondremos en contacto pronto.");
    // Potentially clear cart or redirect
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <p className="text-muted-foreground">
          ¿Tienes un cupón? <Link href="#" className="text-primary hover:underline">Haz clic aquí para introducir tu código</Link>
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid lg:grid-cols-[2fr_1fr] gap-12 items-start">
        {/* Left Column: Billing and Additional Info */}
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

        {/* Right Column: Your Order */}
        <div className="sticky top-24 self-start space-y-6">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-headline text-center">TU PEDIDO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                       <button type="button" aria-label="Eliminar producto" className="text-muted-foreground hover:text-destructive p-1">
                        <XIcon size={16} />
                      </button>
                      <Image 
                        src={item.images[0]} 
                        alt={item.name} 
                        width={60} 
                        height={60} 
                        className="rounded-md object-cover aspect-square"
                        data-ai-hint={item.dataAiHint || "product image"} 
                      />
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        {item.selectedColorInCart && <p className="text-xs text-muted-foreground">- {item.selectedColorInCart}</p>}
                        <p className="text-xs text-muted-foreground">&times; {item.quantityInCart}</p>
                      </div>
                    </div>
                    <span className="font-medium text-foreground">
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
