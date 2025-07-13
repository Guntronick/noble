
"use client"; 

import type { Product } from '@/lib/types';
import { getProductBySlug } from '@/app/actions';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { RelatedProductsClient } from '@/components/products/RelatedProductsClient';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { Facebook, Instagram, Mail, MessageSquare, Twitter } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const LOCAL_STORAGE_VIEWED_PRODUCTS_KEY = 'nobleViewedProducts';
const MAX_VIEWED_PRODUCTS = 20;

const colorNameToHex: { [key: string]: string } = {
  'rojo': '#dc2626',
  'azul': '#2563eb',
  'verde': '#16a34a',
  'negro': '#171717',
  'blanco': '#ffffff',
  'gris': '#a1a1aa',
  'amarillo': '#f59e0b',
  'naranja': '#f97316',
  'violeta': '#9333ea',
  'celeste': '#0ea5e9',
};

const getColorHex = (colorName: string) => {
  const lowerCaseColor = colorName.toLowerCase();
  if (colorNameToHex[lowerCaseColor]) {
    return colorNameToHex[lowerCaseColor];
  }
  return lowerCaseColor.startsWith('#') ? lowerCaseColor : '#a1a1aa';
};

export default function ProductDetailPage() {
  const { toast } = useToast();
  const params = useParams<{ productId: string }>(); 
  const productSlug = params.productId;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1); 
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [imagesToDisplay, setImagesToDisplay] = useState<string[]>([]);
  
  useEffect(() => {
    async function loadProduct() {
      if (!productSlug) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const decodedSlug = decodeURIComponent(productSlug);
        const fetchedProduct = await getProductBySlug(decodedSlug);
        setProduct(fetchedProduct);
        if (fetchedProduct) {
           if (fetchedProduct.colors.length > 0) {
            setSelectedColor(fetchedProduct.colors[0]);
          } else {
            setSelectedColor(''); 
          }
          setQuantity(1);

          if(typeof window !== 'undefined'){
            const viewedProducts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_VIEWED_PRODUCTS_KEY) || '[]');
            const updatedViewed = [fetchedProduct.id, ...viewedProducts.filter((id: string) => id !== fetchedProduct.id)].slice(0, MAX_VIEWED_PRODUCTS);
            localStorage.setItem(LOCAL_STORAGE_VIEWED_PRODUCTS_KEY, JSON.stringify(updatedViewed));
          }
        }
      } catch (error) {
        console.error("Failed to load product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productSlug]);

  useEffect(() => {
    if (product) {
      let newImages: string[] = [];
      if (selectedColor && product.images[selectedColor] && product.images[selectedColor].length > 0) {
        newImages = product.images[selectedColor];
      } else if (product.images.default && product.images.default.length > 0) {
        newImages = product.images.default;
      } else {
        newImages = ['https://placehold.co/600x500.png'];
      }
      setImagesToDisplay(newImages);
      setCurrentImageIndex(0);
    } else {
      setImagesToDisplay(['https://placehold.co/600x500.png']);
      setCurrentImageIndex(0);
    }
  }, [product, selectedColor]);

  const handleShare = (platform: string) => {
    if (typeof window === "undefined" || !product) return;
    const url = window.location.href;
    const text = `Mira este increíble producto: ${product.name}`;
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
        shareUrl = `mailto:?subject=${encodeURIComponent(product.name || 'Producto Interesante')}&body=${encodeURIComponent(text + " " + url)}`;
        break;
    }
    if (shareUrl) window.open(shareUrl, '_blank');
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-8rem)] flex items-center justify-center"><p className="text-2xl text-muted-foreground">Cargando detalles del producto...</p></div>;
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-8rem)] flex items-center justify-center"><p className="text-2xl text-destructive">Producto no encontrado.</p></div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-5 gap-12 items-start">
        {/* Left Column: Image Gallery & Description */}
        <div className="lg:col-span-3 space-y-6">
           <div className="w-full aspect-[6/5] overflow-hidden rounded-lg shadow-xl bg-card relative">
              <Image 
                  src={imagesToDisplay[currentImageIndex]}
                  alt={product.name} 
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 70vw, 1024px"
                  className="object-contain transition-opacity duration-300 ease-in-out" 
                  priority 
                  data-ai-hint={product.dataAiHint || product.name.toLowerCase().split(' ').slice(0,2).join(' ')}
              />
            </div>

            <div className="space-y-4">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground font-headline">{product.name}</h1>
                {product.compare_at_price && product.compare_at_price > product.price ? (
                    <div className="flex items-end gap-2">
                        <span className="text-2xl text-muted-foreground line-through">
                            ${product.compare_at_price.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-4xl lg:text-5xl font-bold text-success">
                            ${product.price.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                ) : (
                    <div className="text-4xl lg:text-5xl font-bold text-price">
                        <span className="text-2xl align-top text-muted-foreground mr-1">$</span>
                        {product.price.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                )}
              <div className="flex items-center space-x-2 flex-wrap">
                  <Badge variant="secondary">Categoría: {product.category}</Badge>
                  <Badge variant="outline">Código: {product.productCode}</Badge>
              </div>
            </div>

            <Separator/>

            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
                <h2 className="text-xl font-bold mb-2 font-headline text-foreground">Descripción del producto:</h2>
                <p>{product.description}</p>
            </div>
        </div>
        
        {/* Right Column: Purchase Box & Info */}
        <div className="sticky top-24 self-start space-y-6 lg:col-span-2">
          <div className="p-6 bg-card rounded-xl shadow-2xl space-y-6">
            
            <p className="text-lg font-semibold text-foreground">
              {product.stock > 0 ? "Stock disponible" : <span className="text-destructive">Agotado</span>}
              {product.stock > 0 && <span className="text-muted-foreground text-sm"> ({product.stock} unidades)</span>}
            </p>
            {product.stock > 0 && product.stock < 10 && <Badge variant="destructive">¡Pocas unidades!</Badge>}

            {product.colors.length > 0 && (
              <div>
                <Label className="text-base font-medium text-foreground">Color:</Label>
                <TooltipProvider>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {product.colors.map((color) => {
                       const hex = getColorHex(color);
                       const isSelected = selectedColor === color;
                       return (
                         <Tooltip key={color} delayDuration={150}>
                           <TooltipTrigger asChild>
                             <button
                               type="button"
                               onClick={() => setSelectedColor(color)}
                               className={cn(
                                 "h-8 w-8 rounded-full border-2 transition-all duration-200",
                                 isSelected ? 'ring-2 ring-offset-2 ring-primary' : 'hover:scale-110',
                                 color.toLowerCase() === 'blanco' ? 'border-gray-300' : 'border-transparent'
                               )}
                               style={{ backgroundColor: hex }}
                               aria-label={`Seleccionar color ${color}`}
                               disabled={product.stock <= 0}
                             />
                           </TooltipTrigger>
                           <TooltipContent>
                             <p>{color}</p>
                           </TooltipContent>
                         </Tooltip>
                       );
                    })}
                  </div>
                </TooltipProvider>
              </div>
            )}
         
            {product.stock > 0 && (
              <div>
                <Label htmlFor="quantity-input-purchasebox" className="text-base font-medium text-foreground">Cantidad:</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input 
                    id="quantity-input-purchasebox" 
                    type="number" 
                    value={quantity === 0 ? "" : quantity.toString()} 
                    onChange={(e) => {
                      const value = e.target.value;
                      const parsedQuantity = parseInt(value, 10);
                      setQuantity(isNaN(parsedQuantity) ? 0 : parsedQuantity);
                    }}
                    className="w-24 h-10"
                    aria-label="Cantidad"
                    disabled={product.stock <=0}
                    min="1"
                    max={product.stock.toString()}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-4">
               <AddToCartButton product={product} selectedColor={selectedColor} quantity={quantity} />
            </div>
            
            <Separator className="my-4"/>
          
            <div>
              <h3 className="text-base font-semibold mb-2 text-foreground">Comparte este producto:</h3>
              <div className="flex space-x-2 flex-wrap gap-y-2">
                <Button variant="outline" size="icon" onClick={() => handleShare('twitter')} aria-label="Compartir en Twitter"><Twitter className="h-5 w-5 text-accent" /></Button>
                <Button variant="outline" size="icon" onClick={() => handleShare('facebook')} aria-label="Compartir en Facebook"><Facebook className="h-5 w-5 text-accent" /></Button>
                <Button variant="outline" size="icon" onClick={() => handleShare('instagram')} aria-label="Compartir en Instagram"><Instagram className="h-5 w-5 text-accent" /></Button>
                <Button variant="outline" size="icon" onClick={() => handleShare('whatsapp')} aria-label="Compartir en WhatsApp"><MessageSquare className="h-5 w-5 text-accent" /></Button>
                <Button variant="outline" size="icon" onClick={() => handleShare('email')} aria-label="Compartir por Email"><Mail className="h-5 w-5 text-accent" /></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Productos Relacionados */}
      <Separator className="my-12 lg:my-16" />
      {product && <RelatedProductsClient productId={product.id} categoryName={product.category} />}
    </div>
  );
}
