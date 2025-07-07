# Guía de Recreación de E-commerce con IA - Plantilla Detallada

Este documento contiene un conjunto de prompts e instrucciones detalladas para construir una aplicación web de e-commerce con Next.js, ShadCN, Tailwind y Genkit AI. El objetivo es replicar la funcionalidad y el diseño de un proyecto base, permitiendo una personalización rápida para futuros desarrollos.

---

## Sección 1: Branding y Configuración Inicial de la Interfaz

### **Prompt 1.1: Configurar Paleta de Colores y Tema**

**Instrucción para la IA:** Modifica el archivo `src/app/globals.css`. Reemplaza el contenido completo del archivo con el siguiente código CSS.

**Personalización:** Antes de enviar, reemplaza los valores HSL en los bloques `:root` y `.dark` con la paleta de colores de tu nueva marca.

**Código a utilizar:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Proporciona aquí tu paleta de colores para el tema claro */
    --background: 210 20% 98%;
    --foreground: 208 12% 15%;
    --panel-background: 205 44% 21%;
    --panel-foreground: 0 0% 100%;
    --card: 0 0% 100%;
    --card-foreground: 208 12% 15%;
    --popover: 0 0% 100%;
    --popover-foreground: 208 12% 15%;
    --primary: 205 44% 21%;
    --primary-foreground: 0 0% 100%;
    --secondary: 145 25% 60%;
    --secondary-foreground: 208 12% 15%;
    --muted: 210 16% 93%;
    --muted-foreground: 210 9% 40%;
    --accent: 34 81% 54%;
    --accent-foreground: 0 0% 100%;
    --success-bg: 145 50% 40%;
    --success-foreground: 0 0% 100%;
    --price-text-color: 87 45% 44%;
    --cta-orange: 18 100% 60%;
    --cta-orange-foreground: 0 0% 100%;
    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 100%;
    --border: 210 14% 89%;
    --input: 210 14% 96%;
    --ring: 205 44% 21%;
    --radius: 0.5rem;
  }

  .dark {
    /* Proporciona aquí tu paleta de colores para el tema oscuro */
    --background: 220 13% 18%;
    --foreground: 0 0% 100%;
    --panel-background: 220 13% 15%;
    --panel-foreground: 0 0% 100%;
    --card: 220 13% 22%;
    --card-foreground: 0 0% 100%;
    --popover: 220 13% 18%;
    --popover-foreground: 0 0% 100%;
    --primary: 205 44% 60%;
    --primary-foreground: 220 13% 15%;
    --secondary: 220 13% 30%;
    --secondary-foreground: 0 0% 100%;
    --muted: 220 13% 26%;
    --muted-foreground: 220 10% 70%;
    --accent: 34 81% 54%;
    --accent-foreground: 0 0% 100%;
    --success-bg: 145 50% 40%;
    --success-foreground: 0 0% 100%;
    --price-text-color: 87 45% 55%;
    --cta-orange: 18 100% 60%;
    --cta-orange-foreground: 0 0% 100%;
    --destructive: 0 63% 51%;
    --destructive-foreground: 0 0% 100%;
    --border: 220 13% 28%;
    --input: 220 13% 28%;
    --ring: 205 44% 60%;
  }
}

@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground font-body; }
  h1, h2, h3, h4, h5, h6 { @apply font-headline; }
}
```

### **Prompt 1.2: Configurar Tipografía**

**Instrucción para la IA:**
1.  Verifica que el archivo `src/app/layout.tsx` incluya las siguientes etiquetas `<link>` dentro de `<head>` para importar las fuentes.
2.  Modifica `tailwind.config.ts` para que `theme.extend.fontFamily` use estas fuentes.

**Personalización:** Reemplaza 'Poppins' y 'Roboto' si tu marca requiere tipografías diferentes.

**Código para `src/app/layout.tsx`:**
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
```

**Código para `tailwind.config.ts`:**
```javascript
// ...
extend: {
  fontFamily: {
    body: ['Roboto', 'sans-serif'],
    headline: ['Poppins', 'sans-serif'],
    code: ['monospace'],
  },
// ...
```

### **Prompt 1.3: Actualizar el Logo**

**Instrucción para la IA:** En el archivo `src/components/ui/Logo.tsx`, localiza el componente `<Image>` y cambia su prop `src`.

**Personalización:** Proporciona la ruta a tu nuevo archivo de logo, que debe estar en la carpeta `/public/images/`.

**Ejemplo de cambio:**
```jsx
// De:
src="/images/logo-noble.png"
// A (ejemplo):
src="/images/nuevo-logo.png"
```

### **Prompt 1.4: Personalizar el Pie de Página (Footer)**

**Instrucción para la IA:** Modifica `src/components/layout/Footer.tsx`. Actualiza el texto y el enlace del desarrollador.

**Personalización:** Proporciona el nombre y la URL del desarrollador.

**Instrucción específica:**
-   El texto debe ser "Desarrollado por [NOMBRE_DEL_DESARROLLADOR]".
-   La palabra [NOMBRE_DEL_DESARROLLADOR] debe ser un hipervínculo a [URL_DEL_DESARROLLADOR].

### **Prompt 1.5: Configurar Botón de WhatsApp**

**Instrucción para la IA:** En `src/components/layout/FloatingWhatsAppButton.tsx`, actualiza la variable `phoneNumber`.

**Personalización:** Proporciona el número de teléfono del negocio.

**Ejemplo de cambio:**
```jsx
// De:
const phoneNumber = "3516769103";
// A (ejemplo):
const phoneNumber = "5491112345678";
```

---

## Sección 2: Contenido de Páginas Específicas

### **Prompt 2.1: Personalizar Página de Inicio**

**Instrucción para la IA:** Edita el archivo `src/app/(default)/page.tsx`.

**Personalización:** Proporciona los textos para el "Hero Section" y las características principales.
-   Actualiza el `<h1>` con el eslogan principal.
-   Actualiza el `<p>` con el texto descriptivo.
-   Actualiza los `<h3>` y `<p>` de las tres características en la sección "¿Por Qué Elegirnos?".

### **Prompt 2.2: Actualizar Página de Contacto**

**Instrucción para la IA:** Edita el archivo `src/app/(default)/contact/page.tsx`.

**Personalización:** Proporciona la información de contacto real del negocio.
-   Actualiza el texto para la dirección, email, teléfono y horario de atención.

### **Prompt 2.3: Configurar Email de Destino del Formulario de Contacto**

**Instrucción para la IA:** Edita el archivo `src/app/api/contact/route.ts`. Cambia el valor de la variable `mailTo`.

**Personalización:** Proporciona el email que recibirá los mensajes del formulario.

**Ejemplo de cambio:**
```javascript
// De:
const mailTo = process.env.CONTACT_FORM_EMAIL_TARGET || "your-email@example.com";
// A (ejemplo):
const mailTo = process.env.CONTACT_FORM_EMAIL_TARGET || "ventas@mi-ecommerce.com";
```

---

## Sección 3: Lógica Clave del E-commerce

### **Prompt 3.1: Corregir Página de Detalles del Producto**

**Instrucción para la IA:** En el archivo `src/app/(default)/products/[productId]/page.tsx`, realiza las siguientes modificaciones directas al código:
1.  **Panel de descripción:** Aplica la clase `bg-muted` al `<div>` que contiene la descripción del producto (`h1`, `p`, etc.) para que se vea bien en modo oscuro.
2.  **Decodificación de Slugs:** Dentro de la función `loadProduct`, justo antes de la línea `const fetchedProduct = await getProductBySlug(productSlug);`, inserta esta línea: `const decodedSlug = decodeURIComponent(productSlug);`. Luego, usa `decodedSlug` en la llamada a la función.
3.  **Botón "Agregar al Carrito":** Asegúrate de que el componente `AddToCartButton` use `variant="success"`.

---

## Sección 4: Personalización con Inteligencia Artificial

### **Prompt 4.1: Implementar Seguimiento de Historial de Usuario**

**Instrucción para la IA:** En `src/app/(default)/products/[productId]/page.tsx`, dentro del `useEffect` de `loadProduct`, localiza el `if (fetchedProduct)` y añade el siguiente bloque de código dentro de él para guardar los productos visitados en `localStorage`.

**Código a insertar:**
```javascript
const viewedProducts = JSON.parse(localStorage.getItem('nobleViewedProducts') || '[]');
const updatedViewed = [fetchedProduct.id, ...viewedProducts.filter((id: string) => id !== fetchedProduct.id)].slice(0, 20);
localStorage.setItem('nobleViewedProducts', JSON.stringify(updatedViewed));
```

### **Prompt 4.2: Crear Flujo de IA para Recomendaciones (Genkit)**

**Instrucción para la IA:** Crea el archivo `src/ai/flows/recommend-products-flow.ts` y pega el siguiente contenido.

**Personalización:** Puedes adaptar los ejemplos de slugs (`'tazas'`, `'accesorios-tech'`) en la descripción de `recommendedCategorySlugs` para que coincidan con las categorías de tu proyecto.

**Código a utilizar:**
```typescript
'use server';
/**
 * @fileOverview An AI flow for generating personalized product recommendations.
 * - getPersonalizedRecommendations - Analyzes a user's viewing history and recommends product categories.
 * - RecommendationRequest - The input type for the recommendation flow.
 * - RecommendationResponse - The output type for the recommendation flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ViewedProductSchema = z.object({
  name: z.string().describe('The name of the product the user viewed.'),
  description: z.string().nullable().describe('The description of the product.'),
  category: z.string().describe('The category of the product.'),
});

const RecommendationRequestSchema = z.object({
  viewedProducts: z.array(ViewedProductSchema).describe('A list of products the user has recently viewed.'),
});
export type RecommendationRequest = z.infer<typeof RecommendationRequestSchema>;

const RecommendationResponseSchema = z.object({
  interestSummary: z.string().describe("A brief, one-sentence summary of the user's likely interests based on their browsing history."),
  recommendedCategorySlugs: z.array(z.string()).describe("A list of up to 3 relevant category slugs (e.g., 'tazas', 'accesorios-tech', 'indumentaria') that the user might be interested in. These slugs must be based on the categories from the viewed products."),
});
export type RecommendationResponse = z.infer<typeof RecommendationResponseSchema>;


const recommendationPrompt = ai.definePrompt({
    name: 'productRecommenderPrompt',
    input: { schema: RecommendationRequestSchema },
    output: { schema: RecommendationResponseSchema },
    prompt: `You are an expert e-commerce merchandiser for a tech and design-focused merchandise store.
Your goal is to provide personalized product category recommendations based on a user's viewing history.

Analyze the following list of recently viewed products:
{{#each viewedProducts}}
- Name: {{name}}
  Category: {{category}}
  Description: {{description}}
{{/each}}

Based on this history, determine the user's primary interests.
Generate a short summary of these interests.
Then, identify the top 2-3 most relevant and distinct category slugs that would appeal to this user.
The slugs should be derived from the 'Category' field of the viewed products. For example if a category is "Tazas y Mates", the slug could be "tazas-y-mates". If the category is "Indumentaria", the slug could be "indumentaria".

Return your response in the specified JSON format.
`,
});

const recommendFlow = ai.defineFlow(
  {
    name: 'recommendFlow',
    inputSchema: RecommendationRequestSchema,
    outputSchema: RecommendationResponseSchema,
  },
  async (input) => {
    const { output } = await recommendationPrompt(input);
    if (!output) {
        return {
            interestSummary: "No specific interests could be determined.",
            recommendedCategorySlugs: [],
        };
    }
    return output;
  }
);

export async function getPersonalizedRecommendations(
  input: RecommendationRequest
): Promise<RecommendationResponse> {
  return await recommendFlow(input);
}
```

### **Prompt 4.3: Integrar Recomendaciones en el Frontend**

**Instrucción para la IA:** Reemplaza el contenido completo de `src/components/products/RelatedProductsClient.tsx` con el siguiente código para que obtenga y muestre las recomendaciones de la IA.

**Código a utilizar:**
```tsx
"use client";

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { getRelatedProducts, getProductsByIds, getProducts } from '@/lib/data';
import { getPersonalizedRecommendations, type RecommendationRequest } from '@/ai/flows/recommend-products-flow';
import { Skeleton } from '@/components/ui/skeleton';

const LOCAL_STORAGE_VIEWED_PRODUCTS_KEY = 'nobleViewedProducts';

interface RelatedProductsClientProps {
  productId: string; 
  categoryName: string; 
}

export function RelatedProductsClient({ productId, categoryName }: RelatedProductsClientProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRelated() {
      setLoading(true);
      setError(null);
      try {
        let personalizedProducts: Product[] = [];
        
        const viewedProductIds = JSON.parse(localStorage.getItem(LOCAL_STORAGE_VIEWED_PRODUCTS_KEY) || '[]') as string[];
        if (viewedProductIds.length > 1) {
            const viewedProducts = await getProductsByIds(viewedProductIds);
            if(viewedProducts.length > 0) {
              const recommendationRequest: RecommendationRequest = {
                  viewedProducts: viewedProducts.map(p => ({
                      name: p.name,
                      description: p.description,
                      category: p.category
                  }))
              };
              const recommendations = await getPersonalizedRecommendations(recommendationRequest);
              
              if(recommendations.recommendedCategorySlugs.length > 0) {
                 const recommendedProductsPromises = recommendations.recommendedCategorySlugs.map(slug => getProducts({ categorySlug: slug, limit: 2 }));
                 const productsByCat = await Promise.all(recommendedProductsPromises);
                 personalizedProducts = productsByCat.flat();
              }
            }
        }
        
        const sameCategoryProducts = await getRelatedProducts(categoryName, productId, 4);

        const combined = [...personalizedProducts, ...sameCategoryProducts];
        const uniqueProductIds = new Set<string>();
        const finalProducts = combined
          .filter(p => p.id !== productId)
          .filter(p => {
            if (uniqueProductIds.has(p.id)) {
              return false;
            }
            uniqueProductIds.add(p.id);
            return true;
          });

        setRelatedProducts(finalProducts.slice(0, 4));
        
      } catch (err) {
        console.error('Error fetching related products:', err);
        setError('Error al cargar productos relacionados.');
      } finally {
        setLoading(false);
      }
    }

    fetchRelated();
  }, [productId, categoryName]);

  if (loading) {
    return (
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8 text-primary font-headline">También te podría gustar...</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[300px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold mb-8 text-primary font-headline">También te podría gustar...</h2>
        <p className="text-destructive">{error}</p>
      </div>
    );
  }
  
  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold mb-8 text-primary font-headline">También te podría gustar...</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

---
## Sección 5: Dependencias y Versiones

**Nota para el desarrollador:** Este proyecto fue construido con las siguientes dependencias principales. Para recrearlo, asegúrate de tener versiones compatibles en tu `package.json`.
- `next`: ~15.2.3
- `react`: ~18.3.1
- `tailwindcss`: ~3.4.1
- `genkit`: ~1.8.0
- `lucide-react`: ~0.475.0
- `@supabase/supabase-js`: ~2.44.4

Esta guía asume que los componentes de ShadCN ya están instalados en el proyecto.
