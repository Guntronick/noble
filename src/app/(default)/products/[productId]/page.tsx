
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
import { Twitter, Facebook, Instagram, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState, useEffect, use, useRef } from 'react';
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
  AlertDialogTrigger, // Added AlertDialogTrigger here
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';

async function fetchProduct(slug: string): Promise<Product | null> {
  const product = getProductBySlug(slug);
  return product ? Promise.resolve(product) : Promise.resolve(null);
}

interface ProductDetailPageProps {
  params: { productId: string }; 
}

const LENS_SIZE = 100; 
const ZOOM_FACTOR = 2.5; 

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

  const [showZoom, setShowZoom] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [zoomBackgroundPosition, setZoomBackgroundPosition] = useState({ x: 0, y: 0 });
  
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const purchaseBoxRef = useRef<HTMLDivElement>(null);
  const mainGridRef = useRef<HTMLDivElement>(null);

  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [zoomPanelStyle, setZoomPanelStyle] = useState<React.CSSProperties>({});


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

  useEffect(() => {
    if (imageContainerRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      setImageDimensions({ width: rect.width, height: rect.height });
    }
  }, [currentImageIndex, product, showZoom]);

  useEffect(() => {
    if (!showZoom || !imageContainerRef.current || !purchaseBoxRef.current || !mainGridRef.current || imageDimensions.width === 0 || !product) {
      setZoomPanelStyle(prev => ({ ...prev, display: 'none' }));
      return;
    }
  
    const mainImageSrc = product.images[currentImageIndex] || 'https://placehold.co/600x500.png';
    
    const panelWidth = purchaseBoxRef.current.offsetWidth;
    const panelHeight = purchaseBoxRef.current.offsetHeight;
    const panelLeft = purchaseBoxRef.current.offsetLeft;
    const panelTop = purchaseBoxRef.current.offsetTop;
    
    setZoomPanelStyle({
      display: 'block', 
      position: 'absolute',
      left: `${panelLeft}px`,
      top: `${panelTop}px`,
      width: `${panelWidth}px`,
      height: `${panelHeight}px`,
      backgroundImage: `url(${mainImageSrc})`,
      backgroundPosition: `${zoomBackgroundPosition.x}px ${zoomBackgroundPosition.y}px`,
      backgroundSize: `${imageDimensions.width * ZOOM_FACTOR}px ${imageDimensions.height * ZOOM_FACTOR}px`,
      backgroundRepeat: 'no-repeat',
      zIndex: 50, 
      border: '1px solid hsl(var(--border))', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)', 
      backgroundColor: 'hsl(var(--background))', 
      overflow: 'hidden',
    });
  
  }, [showZoom, imageDimensions, product, currentImageIndex, zoomBackgroundPosition, ZOOM_FACTOR]);

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

  const handleRequestQuoteOnly = () => {
    console.log("Solicitando presupuesto solo para:", product?.name, quantity, selectedColor);
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
    const currentQuantity = Number.isNaN(quantity) || quantity < 1 ? 1 : quantity;
    if (currentQuantity <= 0) {
      toast({
        title: "Cantidad inválida",
        description: "Por favor, introduce una cantidad mayor que cero.",
        variant: "destructive",
      });
      return;
    }
    console.log(`Añadido al carrito: ${product.name}, Color: ${selectedColor || 'N/A'}, Cantidad: ${currentQuantity}`);
    toast({
      title: "¡Artículo Añadido!",
      description: `${currentQuantity} x "${product.name}" ${product.colors.length > 0 && selectedColor ? `(Color: ${selectedColor})` : ''} fue añadido a tu carrito.`,
    });
    setIsQuoteModalOpen(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || !purchaseBoxRef.current || imageDimensions.width === 0 || imageDimensions.height === 0) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = Math.max(0, Math.min(x, imageDimensions.width));
    y = Math.max(0, Math.min(y, imageDimensions.height));

    let newLensX = x - LENS_SIZE / 2;
    let newLensY = y - LENS_SIZE / 2;

    newLensX = Math.max(0, Math.min(newLensX, imageDimensions.width - LENS_SIZE));
    newLensY = Math.max(0, Math.min(newLensY, imageDimensions.height - LENS_SIZE));
    
    setLensPosition({ x: newLensX, y: newLensY });
    
    const panelWidth = purchaseBoxRef.current.offsetWidth;
    const panelHeight = purchaseBoxRef.current.offsetHeight;

    const bgX = -(newLensX * ZOOM_FACTOR) + (panelWidth / 2) - (LENS_SIZE / 2 * ZOOM_FACTOR) ;
    const bgY = -(newLensY * ZOOM_FACTOR) + (panelHeight / 2) - (LENS_SIZE / 2 * ZOOM_FACTOR) ;
    setZoomBackgroundPosition({ x: bgX, y: bgY });
  };

  const handleMouseEnter = () => {
    if (imageContainerRef.current && purchaseBoxRef.current) { 
        const rect = imageContainerRef.current.getBoundingClientRect();
        setImageDimensions({ width: rect.width, height: rect.height }); 
        if (rect.width > 0) { 
            setShowZoom(true);
        }
    }
  };
  const handleMouseLeave = () => setShowZoom(false);


  if (loading) {
    return <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-8rem)] flex items-center justify-center"><p className="text-2xl text-muted-foreground">Cargando detalles del producto...</p></div>;
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-8rem)] flex items-center justify-center"><p className="text-2xl text-destructive">Producto no encontrado.</p></div>;
  }
  
  const mainImageSrc = product.images[currentImageIndex] || 'https://placehold.co/600x500.png';

  return (
    <div className="container mx-auto px-4 py-12">
      <div ref={mainGridRef} className="grid grid-cols-1 lg:grid-cols-[minmax(100px,0.7fr)_3fr_2fr] xl:grid-cols-[minmax(120px,0.5fr)_3fr_2fr] gap-6 lg:gap-8 items-start relative">
        
        <div className="self-start hidden lg:flex lg:flex-col space-y-3 pr-2">
          {product.images.map((img, index) => (
            <button 
              key={index} 
              onClick={() => setCurrentImageIndex(index)}
              className={cn(
                "block w-full aspect-square relative rounded-md overflow-hidden border-2 transition-all duration-200 focus:outline-none",
                currentImageIndex === index ? 'border-primary ring-2 ring-primary shadow-md' : 'border-border hover:border-muted-foreground/50'
              )}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <Image 
                src={img} 
                alt={`${product.name} miniatura ${index + 1}`} 
                fill
                sizes="(max-width: 1023px) 0vw, 100px" 
                className="object-cover hover:opacity-80 transition-opacity" 
                data-ai-hint={product.dataAiHint ? `${product.dataAiHint} thumb ${index+1}` : `${product.name.toLowerCase().split(' ').slice(0,2).join(' ')} thumb ${index+1}`}
              />
            </button>
          ))}
        </div>

        <div className="lg:col-start-2 space-y-6">
            <div 
              ref={imageContainerRef}
              className="relative w-full aspect-[6/5] overflow-hidden rounded-lg shadow-xl"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            >
              <Image 
                src={mainImageSrc} 
                alt={product.name} 
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 70vw, 600px"
                className="object-contain transition-opacity duration-300 ease-in-out" 
                priority 
                data-ai-hint={product.dataAiHint || product.name.toLowerCase().split(' ').slice(0,2).join(' ')}
              />
              {showZoom && imageDimensions.width > 0 && (
                <div 
                  className="absolute border-2 border-primary/50 bg-white/20 pointer-events-none"
                  style={{
                    left: `${lensPosition.x}px`,
                    top: `${lensPosition.y}px`,
                    width: `${LENS_SIZE}px`,
                    height: `${LENS_SIZE}px`,
                    cursor: 'crosshair',
                  }}
                />
              )}
            </div>
            
            <div className="lg:hidden grid grid-cols-4 sm:grid-cols-5 gap-2">
              {product.images.map((img, index) => (
                <button
                  key={`mobile-thumb-${index}`}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    "aspect-square rounded-md overflow-hidden border-2 transition-all relative",
                    currentImageIndex === index ? "border-primary ring-2 ring-primary" : "border-transparent hover:border-muted-foreground/50"
                  )}
                  aria-label={`Ver imagen ${index + 1} (móvil)`}
                >
                  <Image 
                    src={img} 
                    alt={`${product.name} miniatura ${index + 1}`} 
                    fill
                    sizes="20vw"
                    className="object-cover hover:opacity-80"
                    data-ai-hint={product.dataAiHint ? `${product.dataAiHint} mobile thumb ${index+1}` : `${product.name.toLowerCase().split(' ').slice(0,2).join(' ')} mobile thumb ${index+1}`}
                  />
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-2 flex-wrap">
                <Badge variant="outline">Categoría: {product.category}</Badge>
                <Badge variant="secondary">Código: {product.productCode}</Badge>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-primary font-headline">{product.name}</h1>
              <p className="text-4xl lg:text-5xl font-semibold text-olive-green">${product.price.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              
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

        <div ref={purchaseBoxRef} className="p-6 bg-card rounded-xl shadow-2xl space-y-5 self-start">
          <p className="text-lg font-semibold">
            {product.stock > 0 ? "Stock disponible" : <span className="text-destructive">Agotado</span>}
          </p>
          {product.stock > 0 && product.stock < 10 && <Badge variant="destructive" className="bg-yellow-500 text-black mt-1">¡Pocas unidades!</Badge>}
         
          {product.stock > 0 && (
            <div>
              <Label htmlFor="quantity-input-purchasebox" className="text-base font-medium">Cantidad:</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input 
                  id="quantity-input-purchasebox" 
                  type="number" 
                  min="1" 
                  max={product.stock > 0 ? product.stock : undefined} 
                  value={quantity} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    const currentStock = product.stock || 1;
                     if (Number.isNaN(val) || val < 1) {
                        setQuantity(1);
                    } else if (val > currentStock && currentStock > 0) { 
                        setQuantity(currentStock);
                    } else if (currentStock === 0) { 
                        setQuantity(1); 
                    } else {
                        setQuantity(val);
                    }
                  }} 
                  className="w-20 h-10"
                  aria-label="Cantidad"
                  disabled={product.stock <=0}
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
                  onClick={(e) => { if (product.stock <= 0) e.preventDefault(); }}
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
                <AlertDialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row">
                  <AlertDialogAction onClick={handleRequestQuoteOnly} className="w-full sm:w-auto">Solicitar presupuesto</AlertDialogAction>
                  <AlertDialogCancel onClick={handleAddToCartAndContinue} className="w-full sm:w-auto mt-2 sm:mt-0">Agregar al carrito</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <AddToCartButton product={product} selectedColor={selectedColor} quantity={quantity} variant="secondary" />
          </div>
          
          <Separator className="my-4"/>
          
          <div>
            <h3 className="text-base font-semibold mb-2 text-foreground">Comparte este producto:</h3>
            <div className="flex space-x-2 flex-wrap gap-y-2">
              <Button variant="outline" size="icon" onClick={() => handleShare('twitter')} aria-label="Compartir en Twitter"><Twitter className="h-5 w-5" /></Button>
              <Button variant="outline" size="icon" onClick={() => handleShare('facebook')} aria-label="Compartir en Facebook"><Facebook className="h-5 w-5" /></Button>
              <Button variant="outline" size="icon" onClick={() => handleShare('instagram')} aria-label="Compartir en Instagram"><Instagram className="h-5 w-5" /></Button>
              <Button variant="outline" size="icon" onClick={() => handleShare('whatsapp')} aria-label="Compartir en WhatsApp"><MessageSquare className="h-5 w-5" /></Button>
              <Button variant="outline" size="icon" onClick={() => handleShare('email')} aria-label="Compartir por Email"><Mail className="h-5 w-5" /></Button>
            </div>
          </div>
        </div>

        {showZoom && imageDimensions.width > 0 && product && purchaseBoxRef.current && (
          <div
            className="absolute hidden lg:block pointer-events-none" 
            style={zoomPanelStyle}
          />
        )}
      </div>
      
      <Separator className="my-12 lg:my-16" />
      
      {product && <RelatedProductsClient productId={product.id} categoryName={product.category} />}
    </div>
  );
}
    

    

    