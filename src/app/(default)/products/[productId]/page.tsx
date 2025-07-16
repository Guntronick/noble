
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
import { useEffect, useState, useRef } from 'react';

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

const ProductImageThumbnails = ({ 
  images, 
  onSelectImage, 
  selectedImage,
  productName
}: { 
  images: string[], 
  onSelectImage: (image: string) => void, 
  selectedImage: string,
  productName: string 
}) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {images.map((image, index) => (
        <button
          key={index}
          onClick={() => onSelectImage(image)}
          className={cn(
            "relative aspect-square w-full overflow-hidden rounded-md border-2 transition-all duration-200",
            selectedImage === image 
              ? "border-primary ring-2 ring-primary" 
              : "border-border hover:border-muted-foreground/50"
          )}
        >
          <Image
            src={image}
            alt={`${productName} - Miniatura ${index + 1}`}
            fill
            style={{ objectFit: 'cover' }}
            className="hover:opacity-80"
          />
        </button>
      ))}
    </div>
  );
};


export default function ProductDetailPage() {
  const { toast } = useToast();
  const params = useParams<{ productId: string }>(); 
  const productSlug = params.productId;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1); 

  const [imagesToDisplay, setImagesToDisplay] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  
  const [isZooming, setIsZooming] = useState(false);
  const [[imgWidth, imgHeight], setImgSize] = useState([0, 0]);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const imageContainerRef = useRef<HTMLDivElement>(null);

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
      setSelectedImage(newImages[0]);
    } else {
      setImagesToDisplay(['https://placehold.co/600x500.png']);
      setSelectedImage('https://placehold.co/600x500.png');
    }
  }, [product, selectedColor]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!imageContainerRef.current) return;
      const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
      
      const x = e.clientX - left;
      const y = e.clientY - top;

      setPosition({ x, y });

      if (imgWidth === 0 || imgHeight === 0) {
        setImgSize([width, height]);
      }
  };

  const handleMouseEnter = () => setIsZooming(true);
  const handleMouseLeave = () => setIsZooming(false);

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-1 lg:block">
          <ProductImageThumbnails 
            images={imagesToDisplay}
            onSelectImage={setSelectedImage}
            selectedImage={selectedImage}
            productName={product.name}
          />
        </div>

        <div className="lg:col-span-7 flex relative">
            <div 
              ref={imageContainerRef}
              className="relative w-full h-[500px] overflow-hidden rounded-lg bg-transparent"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Image
                src={selectedImage}
                alt={`${product.name} - Imagen principal`}
                fill
                style={{ objectFit: 'contain' }}
                className="transition-opacity duration-300"
                data-ai-hint={product.dataAiHint || product.name.toLowerCase().split(' ').slice(0,2).join(' ')}
              />
            </div>
             {isZooming && (
                <div
                    className="absolute right-full top-0 mr-4 hidden lg:block w-[500px] h-[500px] bg-white border border-border rounded-lg overflow-hidden shadow-2xl z-20 pointer-events-none"
                >
                  <div
                    style={{
                        position: 'absolute',
                        top: `-${position.y * 1.5}px`,
                        left: `-${position.x * 1.5}px`,
                        width: `${imgWidth * 2.5}px`,
                        height: `${imgHeight * 2.5}px`,
                    }}
                  >
                     <Image
                        src={selectedImage}
                        alt="Zoomed product"
                        fill
                        style={{ objectFit: 'contain' }}
                     />
                  </div>
                </div>
            )}
            
        </div>
        
        <div className="lg:col-span-4 self-start">
          <div className="p-6 bg-card rounded-xl shadow-2xl space-y-6">
            
            <p className="text-lg font-semibold text-foreground">
              {product.stock > 0 ? "Stock disponible" : <span className="text-destructive">Agotado</span>}
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
                <Button variant="outline" size="icon" onClick={() => handleShare('twitter')} aria-label="Compartir en Twitter" className="group"><Twitter className="h-5 w-5 text-accent group-hover:text-accent-foreground transition-colors duration-300" /></Button>
                <Button variant="outline" size="icon" onClick={() => handleShare('facebook')} aria-label="Compartir en Facebook" className="group"><Facebook className="h-5 w-5 text-accent group-hover:text-accent-foreground transition-colors duration-300" /></Button>
                <Button variant="outline" size="icon" onClick={() => handleShare('instagram')} aria-label="Compartir en Instagram" className="group"><Instagram className="h-5 w-5 text-accent group-hover:text-accent-foreground transition-colors duration-300" /></Button>
                <Button variant="outline" size="icon" onClick={() => handleShare('whatsapp')} aria-label="Compartir en WhatsApp" className="group"><MessageSquare className="h-5 w-5 text-accent group-hover:text-accent-foreground transition-colors duration-300" /></Button>
                <Button variant="outline" size="icon" onClick={() => handleShare('email')} aria-label="Compartir por Email" className="group"><Mail className="h-5 w-5 text-accent group-hover:text-accent-foreground transition-colors duration-300" /></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
       <div className="lg:hidden grid grid-cols-5 gap-2 mt-4">
            {imagesToDisplay.map((image, index) => (
                <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={cn(
                        "relative aspect-square w-full overflow-hidden rounded-md border-2 transition-all duration-200",
                        selectedImage === image ? "border-primary ring-2 ring-primary" : "border-transparent hover:border-muted-foreground/50"
                    )}
                >
                    <Image src={image} alt={`Miniatura ${index + 1}`} fill style={{ objectFit: 'cover' }} />
                </button>
            ))}
        </div>
      
       <div className="mt-12 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground font-headline">{product.name}</h1>
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
                    <span className="text-3xl align-top mr-1">$</span>
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

      <Separator className="my-12 lg:my-16" />
      {product && <RelatedProductsClient productId={product.id} categoryName={product.category} />}
    </div>
  );
}
