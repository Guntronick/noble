
"use client"; 

import type { Product } from '@/lib/types';
import { getProductBySlug } from '@/lib/data';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { RelatedProductsClient } from '@/components/products/RelatedProductsClient';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Twitter, Facebook, Instagram, Mail, MessageSquare, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

async function fetchProduct(slug: string): Promise<Product | null> {
  const product = getProductBySlug(slug);
  return product ? Promise.resolve(product) : Promise.resolve(null);
}

interface ProductDetailPageProps {
  params: { productId: string }; 
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const resolvedParams = use(params as Promise<{ productId: string }>);
  const { productId: productSlug } = resolvedParams;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!productSlug) return;
      setLoading(true);
      const fetchedProduct = await fetchProduct(productSlug);
      setProduct(fetchedProduct);
      if (fetchedProduct && fetchedProduct.colors.length > 0) {
        setSelectedColor(fetchedProduct.colors[0]);
      } else if (fetchedProduct) {
        setSelectedColor(''); 
      }
      setCurrentImageIndex(0); 
      setQuantity(1); 
      setLoading(false);
    }
    loadProduct();
  }, [productSlug]);

  const handleShare = (platform: string) => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const text = `Mira este increíble producto: ${product?.name}`;
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'instagram':
        alert("Comparte en Instagram copiando el enlace o usando la aplicación.");
        return;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(product?.name || 'Producto Interesante')}&body=${encodeURIComponent(text + " " + url)}`;
        break;
    }
    if (shareUrl) window.open(shareUrl, '_blank');
  };

  const handleRequestQuoteOnly = () => {
    // Simulate adding current product to cart/quote list
    console.log("Solicitando presupuesto solo para:", product?.name, quantity, selectedColor);
    // For now, just navigate. In a real app, you'd update cart state here.
    router.push('/cart'); 
    setIsQuoteModalOpen(false);
  };

  const handleAddToCartAndContinue = () => {
    if (!product) return;
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
    console.log(`Añadido al carrito: ${product.name}, Color: ${selectedColor || 'N/A'}, Cantidad: ${quantity}`);
    toast({
      title: "¡Artículo Añadido!",
      description: `${quantity} x "${product.name}" ${product.colors.length > 0 && selectedColor ? `(Color: ${selectedColor})` : ''} fue añadido a tu carrito.`,
    });
    setIsQuoteModalOpen(false);
  };


  if (loading) {
    return <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-8rem)] flex items-center justify-center"><p className="text-2xl text-muted-foreground">Cargando detalles del producto...</p></div>;
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-8rem)] flex items-center justify-center"><p className="text-2xl text-destructive">Producto no encontrado.</p></div>;
  }
  
  const mainImageSrc = product.images[currentImageIndex] || 'https://placehold.co/600x600.png';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_2fr] xl:grid-cols-[1fr_3fr_2fr] gap-6 lg:gap-8 items-start">
        {/* Column 1: Thumbnails */}
        <div className="hidden lg:flex lg:flex-col space-y-3 sticky top-24 self-start">
          {product.images.map((img, index) => (
            <button 
              key={index} 
              onClick={() => setCurrentImageIndex(index)}
              className={`block w-full aspect-square relative rounded-md overflow-hidden border-2 transition-all duration-200 focus:outline-none
                          ${currentImageIndex === index ? 'border-primary ring-2 ring-primary shadow-md' : 'border-border hover:border-muted-foreground/50'}`}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <Image src={img} alt={`${product.name} miniatura ${index + 1}`} layout="fill" objectFit="cover" className="hover:opacity-80 transition-opacity" />
            </button>
          ))}
        </div>

        {/* Column 2: Main Image + Product Info Below It */}
        <div className="lg:col-start-2 space-y-6">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-xl">
            <Image 
              src={mainImageSrc} 
              alt={product.name} 
              layout="fill" 
              objectFit="contain" 
              priority 
              data-ai-hint={product.dataAiHint || product.name.toLowerCase().split(' ').slice(0,2).join(' ')}
            />
          </div>
          <div className="lg:hidden grid grid-cols-4 sm:grid-cols-5 gap-2">
            {product.images.map((img, index) => (
              <button
                key={`mobile-thumb-${index}`}
                onClick={() => setCurrentImageIndex(index)}
                className={`aspect-square rounded-md overflow-hidden border-2 transition-all
                            ${currentImageIndex === index ? "border-primary ring-2 ring-primary" : "border-transparent hover:border-muted-foreground/50"}`}
                aria-label={`Ver imagen ${index + 1} (móvil)`}
              >
                <Image src={img} alt={`${product.name} miniatura ${index + 1}`} layout="fill" objectFit="cover" className="hover:opacity-80"/>
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-2 flex-wrap">
              <Badge variant="outline">Categoría: {product.category}</Badge>
              <Badge variant="secondary">Código: {product.productCode}</Badge>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary font-headline">{product.name}</h1>
            <p className="text-4xl lg:text-5xl font-semibold text-olive-green">${product.price.toFixed(2)}</p>
            
            <Separator/>
            
            <h2 className="text-xl font-semibold mt-4 mb-2 font-headline">Lo que tenés que saber de este producto:</h2>
            <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>{product.description}</p>
            </div>
            
            <Separator className="my-6"/>

            {product.colors.length > 0 && (
              <div>
                <Label htmlFor="color-select" className="text-base font-medium">Color:</Label>
                <Select value={selectedColor} onValueChange={setSelectedColor} disabled={product.stock <= 0}>
                  <SelectTrigger id="color-select" className="w-full md:w-2/3 mt-1">
                    <SelectValue placeholder="Selecciona un color" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.colors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Purchase Box */}
        <div className="p-6 bg-card rounded-xl shadow-2xl space-y-5 lg:sticky lg:top-24 self-start">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Truck className="h-6 w-6 text-green-600" />
              <p className="font-semibold text-green-600">Llega gratis <span className="font-normal text-muted-foreground">entre el X y el Y de Mes</span></p>
            </div>
          </div>
          
          <Separator/>

          <div>
            <p className="text-lg font-semibold">
              {product.stock > 0 ? "Stock disponible" : <span className="text-destructive">Agotado</span>}
            </p>
            {product.stock > 0 && product.stock < 10 && <Badge variant="destructive" className="bg-yellow-500 text-black mt-1">¡Pocas unidades!</Badge>}
          </div>

          {product.stock > 0 && (
            <div>
              <Label htmlFor="quantity-input-purchasebox" className="text-base font-medium">Cantidad:</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input 
                  id="quantity-input-purchasebox" 
                  type="number" 
                  min="1" 
                  max={product.stock} 
                  value={quantity} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (val >=1 && val <= product.stock) setQuantity(val);
                    else if (val < 1) setQuantity(1);
                    else if (val > product.stock) setQuantity(product.stock);
                  }} 
                  className="w-20 h-10"
                  aria-label="Cantidad"
                />
              </div>
            </div>
          )}
          
          <div className="space-y-3 pt-2">
            <AlertDialog open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen}>
              <AlertDialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-base py-3" 
                  disabled={product.stock <= 0}
                >
                  Solicitar Presupuesto
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Acción</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Desea solicitar el presupuesto solo de este producto o desea agregar más productos al carrito?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 sm:gap-0">
                  <AlertDialogAction onClick={handleRequestQuoteOnly}>Solicitar presupuesto</AlertDialogAction>
                  <AlertDialogCancel onClick={handleAddToCartAndContinue}>Agregar al carrito</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <AddToCartButton product={product} selectedColor={selectedColor} quantity={quantity} variant="secondary" />
          </div>
          
          <Separator className="my-4"/>
          
          <div>
            <h3 className="text-base font-semibold mb-2 text-foreground">Comparte este producto:</h3>
            <div className="flex space-x-2 flex-wrap">
              <Button variant="outline" size="icon" onClick={() => handleShare('twitter')} aria-label="Compartir en Twitter"><Twitter className="h-5 w-5" /></Button>
              <Button variant="outline" size="icon" onClick={() => handleShare('facebook')} aria-label="Compartir en Facebook"><Facebook className="h-5 w-5" /></Button>
              <Button variant="outline" size="icon" onClick={() => handleShare('instagram')} aria-label="Compartir en Instagram"><Instagram className="h-5 w-5" /></Button>
              <Button variant="outline" size="icon" onClick={() => handleShare('whatsapp')} aria-label="Compartir en WhatsApp"><MessageSquare className="h-5 w-5" /></Button>
              <Button variant="outline" size="icon" onClick={() => handleShare('email')} aria-label="Compartir por Email"><Mail className="h-5 w-5" /></Button>
            </div>
          </div>
        </div>
      </div>
      
      <Separator className="my-12 lg:my-16" />
      
      <RelatedProductsClient productId={product.id} categoryName={product.category} />
    </div>
  );
}
