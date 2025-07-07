# Guía de Recreación de E-commerce con IA - Plantilla Detallada

Este documento contiene un conjunto de prompts e instrucciones detalladas para construir una aplicación web de e-commerce con Next.js, ShadCN, Tailwind y Genkit AI. El objetivo es replicar la funcionalidad y el diseño de un proyecto base, permitiendo una personalización rápida para futuros desarrollos.

<!-- TODO: Reemplaza "[NOMBRE_DEL_PROYECTO]" por el nombre del nuevo proyecto en todo el documento. -->

---

## Sección 1: Branding y Configuración Inicial de la Interfaz

### **Prompt 1.1: Configurar Paleta de Colores y Tema**

**Instrucción para la IA:** Modifica el archivo `src/app/globals.css`. Reemplaza el contenido completo del archivo con el siguiente código CSS.
<!-- TODO: Reemplaza los valores HSL en los bloques :root y .dark con la paleta de colores de la nueva marca. -->

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Paleta de Ejemplo - Reemplazar con la de la nueva marca */
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
    /* Paleta Oscura de Ejemplo - Reemplazar con la de la nueva marca */
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

**Instrucción para la IA:** Realiza los siguientes dos cambios:
1.  **En `src/app/layout.tsx`**, asegúrate de que se importen las fuentes correctas desde Google Fonts en la sección `<head>`.
    <!-- TODO: Reemplaza 'Poppins' y 'Roboto' si la nueva marca requiere tipografías diferentes. -->
    ```html
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
    ```
2.  **En `tailwind.config.ts`**, configura las `fontFamily` dentro de `theme.extend` para usar estas fuentes.
    ```javascript
    extend: {
      fontFamily: {
        body: ['Roboto', 'sans-serif'],
        headline: ['Poppins', 'sans-serif'],
        code: ['monospace'],
      },
      // ...el resto de la configuración
    }
    ```

### **Prompt 1.3: Actualizar el Logo**

**Instrucción para la IA:** Modifica el componente `src/components/ui/Logo.tsx`. Cambia el `src` del componente `Image` para que apunte a la nueva ruta del logo.
<!-- TODO: Asegúrate de que el logo esté en la carpeta /public/images/ y actualiza la ruta. -->
```jsx
// Antes: src="/images/logo-noble.png"
// Después (ejemplo):
src="/images/nuevo-logo.png"
```

### **Prompt 1.4: Personalizar el Pie de Página (Footer)**

**Instrucción para la IA:** Modifica el archivo `src/components/layout/Footer.tsx`. Actualiza el texto y el enlace del desarrollador.
<!-- TODO: Actualiza el nombre y la URL del desarrollador. -->
-   El texto debe ser "Desarrollado por `[NOMBRE_DESARROLLADOR]`".
-   La palabra `[NOMBRE_DESARROLLADOR]` debe ser un hipervínculo a `[URL_DESARROLLADOR]`.

```jsx
// ...
<span>Desarrollado por</span>
<a
  href="[URL_DESARROLLADOR]" // Reemplazar URL
  // ...
>
  <svg>...</svg>
  [NOMBRE_DESARROLLADOR] // Reemplazar Nombre
</a>
// ...
```

### **Prompt 1.5: Configurar Botón de Contacto Flotante**

**Instrucción para la IA:** Modifica `src/components/layout/FloatingWhatsAppButton.tsx`. Actualiza la variable `phoneNumber` con el nuevo número de WhatsApp.
<!-- TODO: Reemplaza con el número de teléfono del nuevo negocio. -->
```jsx
// Antes: const phoneNumber = "3516769103";
// Después (ejemplo):
const phoneNumber = "5491112345678";
```

---

## Sección 2: Contenido Específico de la Página

### **Prompt 2.1: Personalizar Página de Inicio**

**Instrucción para la IA:** Modifica `src/app/(default)/page.tsx`. Adapta los textos del *Hero Section* y las características para que se alineen con la nueva marca.
<!-- TODO: Adapta los textos del hero section y las características al nuevo negocio. -->
-   **Hero Section:**
    -   `h1`: Actualiza el eslogan principal (antes: "Bienvenido a Noble").
    -   `p`: Cambia el texto descriptivo (antes: "Descubre diseños únicos...").
-   **Sección "¿Por Qué Elegirnos?":**
    -   `h3` y `p`: Adapta los títulos y descripciones de las tres características para reflejar las fortalezas del nuevo e-commerce.

### **Prompt 2.2: Actualizar Página de Contacto**

**Instrucción para la IA:** Modifica `src/app/(default)/contact/page.tsx`. Reemplaza la información de contacto de ejemplo con los datos reales del negocio.
<!-- TODO: Rellena la información de contacto real del nuevo negocio. -->
-   **Dirección:** Actualiza el texto dentro del `<p>` bajo "Nuestra Oficina".
-   **Email:** Actualiza el texto dentro del `<p>` bajo "Escríbenos".
-   **Teléfono:** Actualiza el texto dentro del `<p>` bajo "Llámanos".
-   **Horario de Atención:** Actualiza los textos con el horario correcto.

### **Prompt 2.3: Configurar API de Contacto**

**Instrucción para la IA:** Modifica el archivo `src/app/api/contact/route.ts`. Cambia el valor de la variable `mailTo` para establecer el email de destino que recibirá los envíos del formulario de contacto.
<!-- TODO: Configura el email de destino para los formularios de contacto. -->
```javascript
// Antes: const mailTo = process.env.CONTACT_FORM_EMAIL_TARGET || "your-email@example.com";
// Después (ejemplo):
const mailTo = process.env.CONTACT_FORM_EMAIL_TARGET || "ventas@nuevo-ecommerce.com";
```

---

## Sección 3: Lógica del E-commerce y Correcciones Clave

### **Prompt 3.1: Corregir Página de Detalles del Producto**

**Instrucción para la IA:** Aplica las siguientes correcciones en `src/app/(default)/products/[productId]/page.tsx`:
1.  **Panel de Descripción en Modo Oscuro:** Asegúrate de que el contenedor de la descripción del producto (`<div>` que envuelve `h1`, `p`, etc.) use un color de fondo semántico (`bg-muted`) para que se adapte correctamente a los temas claro y oscuro.
2.  **Decodificación de Slugs:** Decodifica el `productSlug` de la URL usando `decodeURIComponent()` antes de pasarlo a la función `getProductBySlug`. Esto es crucial para manejar correctamente los caracteres especiales como tildes.
    ```javascript
    // Añadir esta línea al inicio de la función loadProduct
    const decodedSlug = decodeURIComponent(productSlug);
    // Usar decodedSlug en la llamada a la BD
    const fetchedProduct = await getProductBySlug(decodedSlug);
    ```
3.  **Lógica del Zoom de Imagen:** Localiza el `useEffect` que calcula las dimensiones de la imagen para el zoom. Elimina `window.innerWidth` de su array de dependencias. El componente ya tiene un event listener de `resize` que maneja esto correctamente, y esta dependencia innecesaria puede causar problemas en el servidor.
4.  **Botón "Agregar al Carrito":** Asegúrate de que el componente `AddToCartButton` use la variante `success` (`variant="success"`), y que esta variante esté correctamente definida en `src/components/ui/button.tsx` y `src/app/globals.css` para que tenga un estilo visual distintivo.

---

## Sección 4: Personalización con Inteligencia Artificial

### **Prompt 4.1: Implementar Seguimiento del Historial del Usuario**

**Instrucción para la IA:** En `src/app/(default)/products/[productId]/page.tsx`, dentro del `useEffect` donde se carga el producto (`loadProduct`), añade la lógica para guardar los IDs de los productos visitados en `localStorage`.

```javascript
// Dentro del if (fetchedProduct) { ... }
const viewedProducts = JSON.parse(localStorage.getItem('nobleViewedProducts') || '[]');
const updatedViewed = [fetchedProduct.id, ...viewedProducts.filter((id: string) => id !== fetchedProduct.id)].slice(0, 20);
localStorage.setItem('nobleViewedProducts', JSON.stringify(updatedViewed));
```

### **Prompt 4.2: Crear Flujo de IA para Recomendaciones (Genkit)**

**Instrucción para la IA:** Crea el archivo `src/ai/flows/recommend-products-flow.ts` con el siguiente contenido. Este flujo analiza el historial de productos vistos y recomienda categorías.

<!-- TODO: Adapta los ejemplos de slugs de categoría (ej., 'tazas', 'accesorios-tech') para que sean representativos de las categorías del nuevo proyecto. -->
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

**Instrucción para la IA:** Reemplaza el contenido completo de `src/components/products/RelatedProductsClient.tsx` con el siguiente código. Este componente obtendrá el historial del usuario, llamará al flujo de IA y mostrará una combinación de productos recomendados y productos de la categoría actual.

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
        
        // 1. Get personalized recommendations based on localStorage history
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
        
        // 2. Get standard related products from the same category
        const sameCategoryProducts = await getRelatedProducts(categoryName, productId, 4);

        // 3. Combine, de-duplicate, and limit results
        const combined = [...personalizedProducts, ...sameCategoryProducts];
        const uniqueProductIds = new Set<string>();
        const finalProducts = combined
          .filter(p => p.id !== productId) // Ensure current product is not shown
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

  // ... (código JSX para mostrar skeletons, errores y productos) ...
  // El JSX debe ser idéntico al de la versión final del archivo.
}
```

---

## Sección 5: Textos Finales

### **Prompt 5.1: Ajustar Título de la Sección de Recomendaciones**

**Instrucción para la IA:** En el archivo `src/components/products/RelatedProductsClient.tsx`, localiza el `<h2>` de la sección de recomendaciones y cambia el texto de "También Te Podría Gustar" a "También te podría gustar...".

```jsx
// Antes: <h2 ...>También Te Podría Gustar</h2>
// Después:
<h2 ...>También te podría gustar...</h2>
```
