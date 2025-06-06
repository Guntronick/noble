
"use client"; 

import { useState, useEffect, use } from 'react'; // Added 'use'
import { getProductBySlug } from '@/lib/data'; // Removed unused 'allProductsStatic'
import type { Product } from '@/lib/types';
import { ProductImageCarousel } from '@/components/products/ProductImageCarousel';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { RelatedProductsClient } from '@/components/products/RelatedProductsClient';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Twitter, Facebook, Instagram, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
// Link import was unused, removing for cleanliness
// import Link from 'next/link'; 

async function fetchProduct(slug: string): Promise<Product | null> {
  const product = getProductBySlug(slug);
  return product ? Promise.resolve(product) : Promise.resolve(null);
}


interface ProductDetailPageProps {
  params: { productId: string }; 
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  // Resolve params using React.use() as per Next.js warning
  const resolvedParams = use(params as Promise<{ productId: string }>);
  const { productId: productSlug } = resolvedParams;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    async function loadProduct() {
      if (!productSlug) return; // Guard against productSlug being undefined if params somehow fail to resolve (though 'use' should handle suspension)
      setLoading(true);
      const fetchedProduct = await fetchProduct(productSlug);
      setProduct(fetchedProduct);
      if (fetchedProduct && fetchedProduct.colors.length > 0) {
        setSelectedColor(fetchedProduct.colors[0]);
      }
      setLoading(false);
    }
    loadProduct();
  }, [productSlug]);

  if (loading) {
    return <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-8rem)] flex items-center justify-center"><p className="text-2xl text-muted-foreground">Cargando detalles del producto...</p></div>;
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-8rem)] flex items-center justify-center"><p className="text-2xl text-destructive">Producto no encontrado.</p></div>;
  }

  const handleShare = (platform: string) => {
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
        shareUrl = `mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(text + " " + url)}`;
        break;
    }
    if (shareUrl) window.open(shareUrl, '_blank');
  };


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div>
          <ProductImageCarousel images={product.images} productName={product.name} dataAiHint={product.dataAiHint} showThumbnails />
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-primary font-headline">{product.name}</h1>
          <div className="flex items-center space-x-2 flex-wrap">
            <Badge variant="outline">Categoría: {product.category}</Badge>
            <Badge variant="secondary">Código: {product.productCode}</Badge>
            {product.stock <= 0 && <Badge variant="destructive">Agotado</Badge>}
            {product.stock > 0 && product.stock < 10 && <Badge variant="destructive" className="bg-yellow-500 text-black">Pocas Unidades</Badge>}
          </div>
          <p className="text-3xl font-semibold text-olive-green">${product.price.toFixed(2)}</p>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          
          <Separator />

          <div className="space-y-4">
            {product.colors.length > 0 && (
              <div>
                <Label htmlFor="color-select" className="text-base font-medium">Color:</Label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger id="color-select" className="w-full md:w-1/2 mt-1">
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

            <div>
              <Label htmlFor="quantity-input" className="text-base font-medium">Cantidad:</Label>
              <Input
                id="quantity-input"
                type="number"
                min="1"
                max={product.stock > 0 ? product.stock : 1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-24 mt-1"
                disabled={product.stock <= 0}
              />
            </div>
          </div>

          <AddToCartButton product={product} selectedColor={selectedColor} quantity={quantity} />
          
          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary font-headline">Comparte este producto:</h3>
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
      <RelatedProductsClient productId={product.id} categoryName={product.category} />
    </div>
  );
}

    