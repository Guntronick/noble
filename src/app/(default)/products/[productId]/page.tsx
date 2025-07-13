
"use client"; 

import type { Product } from '@/lib/types';
import { getProductBySlug } from '@/app/actions';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { RelatedProductsClient } from '@/components/products/RelatedProductsClient';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Twitter, Facebook, Instagram, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const LOCAL_STORAGE_VIEWED_PRODUCTS_KEY = 'nobleViewedProducts';
const MAX_VIEWED_PRODUCTS = 20;
const ZOOM_FACTOR = 2.5; 

// Simple map to convert color names to hex codes for the swatches
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
  // If it's already a hex, return it. Otherwise, default to gray.
  return lowerCaseColor.startsWith('#') ? lowerCaseColor : '#a1a1aa';
};


export default function ProductDetailPage() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams<{ productId: string }>(); 
  const productSlug = params ? params.productId : null;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1); 
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [imagesToDisplay, setImagesToDisplay] = useState<string[]>([]);

  const [showZoom, setShowZoom] = useState(false);
  const [lensRect, setLensRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [zoomBackgroundPosition, setZoomBackgroundPosition] = useState({ x: 0, y: 0 });
  
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const purchaseBoxRef = useRef<HTMLDivElement>(null);
  const mainGridRef = useRef<HTMLDivElement>(null);

  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [zoomPanelStyle, setZoomPanelStyle] = useState<React.CSSProperties>({});

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

          // Add to recently viewed
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
        newImages = ['https://placehold.co/600x500.png']; // Fallback if no images at all
      }
      setImagesToDisplay(newImages);
      setCurrentImageIndex(0); // Reset index when images change
    } else {
      setImagesToDisplay(['https://placehold.co/600x500.png']); // Fallback if no product
      setCurrentImageIndex(0);
    }
  }, [product, selectedColor]);


  useEffect(() => {
    const handleResize = () => {
      if (imageContainerRef.current) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        setImageDimensions({ width: rect.width, height: rect.height });
      }
    };

    // Initial calculation
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); 

  useEffect(() => {
    if (!showZoom || !imageContainerRef.current || !purchaseBoxRef.current || !mainGridRef.current || imageDimensions.width === 0 || imageDimensions.height === 0 || !product || imagesToDisplay.length === 0) {
      setZoomPanelStyle(prev => ({ ...prev, display: 'none' }));
      return;
    }
  
    const mainImageSrc = imagesToDisplay[currentImageIndex] || 'https://placehold.co/600x500.png';
    
    const panelWidth = purchaseBoxRef.current.offsetWidth;
    const panelHeight = imageDimensions.height; 
    
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
  
  }, [showZoom, imageDimensions, product, currentImageIndex, imagesToDisplay, zoomBackgroundPosition]);


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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || !purchaseBoxRef.current || imageDimensions.width === 0 || imageDimensions.height === 0) {
      return;
    }
  
    const imgRect = imageContainerRef.current.getBoundingClientRect();
    const cursorX_onImg = e.clientX - imgRect.left;
    const cursorY_onImg = e.clientY - imgRect.top;
  
    const currentPanelWidth = purchaseBoxRef.current.offsetWidth;
    const currentPanelHeight = imageDimensions.height; 
  
    if (currentPanelWidth === 0 || currentPanelHeight === 0) return;
  
    const effectiveLensWidth = currentPanelWidth / ZOOM_FACTOR;
    const effectiveLensHeight = currentPanelHeight / ZOOM_FACTOR;
  
    let newLensX = cursorX_onImg - effectiveLensWidth / 2;
    let newLensY = cursorY_onImg - effectiveLensHeight / 2;
  
    newLensX = Math.max(0, Math.min(newLensX, imageDimensions.width - effectiveLensWidth));
    newLensY = Math.max(0, Math.min(newLensY, imageDimensions.height - effectiveLensHeight));
    
    setLensRect({ x: newLensX, y: newLensY, width: effectiveLensWidth, height: effectiveLensHeight });
    setZoomBackgroundPosition({ x: -newLensX * ZOOM_FACTOR, y: -newLensY * ZOOM_FACTOR });
  };

  const handleMouseEnter = () => {
    if (imageContainerRef.current && purchaseBoxRef.current) { 
        const rect = imageContainerRef.current.getBoundingClientRect();
        setImageDimensions({ width: rect.width, height: rect.height }); 
        if (rect.width > 0 && rect.height > 0) { 
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
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div ref={mainGridRef} className="grid grid-cols-1 lg:grid-cols-[minmax(100px,0.7fr)_3fr_2fr] xl:grid-cols-[minmax(120px,0.5fr)_3fr_2fr] gap-6 lg:gap-8 items-start relative">
        
        <div className="self-start hidden lg:flex lg:flex-col space-y-3 pr-2">
          {imagesToDisplay.map((img, index) => (
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
              className="relative w-full aspect-[6/5] overflow-hidden rounded-lg shadow-xl cursor-crosshair bg-card" 
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            >
              {imagesToDisplay.length > 0 && (
                <Image 
                  src={imagesToDisplay[currentImageIndex]}
                  alt={product.name} 
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 70vw, 100%"
                  className="object-contain transition-opacity duration-300 ease-in-out" 
                  priority 
                  data-ai-hint={product.dataAiHint || product.name.toLowerCase().split(' ').slice(0,2).join(' ')}
                />
              )}
              {showZoom && imageDimensions.width > 0 && imageDimensions.height > 0 && lensRect.width > 0 && lensRect.height > 0 && imagesToDisplay.length > 0 && (
                <div 
                  className="absolute border-2 border-primary/50 bg-white/20 pointer-events-none"
                  style={{
                    left: `${lensRect.x}px`,
                    top: `${lensRect.y}px`,
                    width: `${lensRect.width}px`,
                    height: `${lensRect.height}px`,
                  }}
                />
              )}
            </div>
            
            <div className="lg:hidden grid grid-cols-4 sm:grid-cols-5 gap-2">
              {imagesToDisplay.map((img, index) => (
                <button
                  key={`mobile-thumb-${index}`}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    "aspect-square rounded-md overflow-hidden border-2 transition-all relative bg-card",
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
        </div>

        <div ref={purchaseBoxRef} className="p-6 bg-card rounded-xl shadow-2xl space-y-5 self-start">
          <div className="space-y-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground font-headline">{product.name}</h1>

            <div className="flex items-center space-x-2 flex-wrap">
              <Badge variant="secondary">Categoría: {product.category}</Badge>
              <Badge variant="outline">Código: {product.productCode}</Badge>
            </div>
          
            <div className="flex items-baseline gap-2">
              {product.compareAtPrice && product.compareAtPrice > product.price ? (
                <>
                  <span className="text-2xl text-muted-foreground line-through">
                    ${product.compareAtPrice.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <div className="text-4xl lg:text-5xl font-bold text-price">
                    <span className="text-3xl lg:text-4xl align-top">$</span>
                    <span>{product.price.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </>
              ) : (
                <div className="text-4xl lg:text-5xl font-bold text-price">
                  <span className="text-3xl lg:text-4xl align-top">$</span>
                  <span>{product.price.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}
            </div>
          </div>
          <Separator/>
          <div className="text-muted-foreground leading-relaxed space-y-2 text-sm">
            <p>{product.description}</p>
          </div>
          
          <p className="text-lg font-semibold text-foreground">
            {product.stock > 0 ? "Stock disponible" : <span className="text-destructive">Agotado</span>}
            {product.stock > 0 && <span className="text-muted-foreground text-sm"> ({product.stock} unidades)</span>}
          </p>
          {product.stock > 0 && product.stock < 10 && <Badge variant="destructive" className="mt-1">¡Pocas unidades!</Badge>}
         
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
          
          <div className="space-y-3 pt-2">
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

        {showZoom && imageDimensions.width > 0 && imageDimensions.height > 0 && product && purchaseBoxRef.current && imagesToDisplay.length > 0 && (
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

    