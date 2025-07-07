
# Guía de Recreación de E-commerce con IA - Plantilla Genérica

Este documento contiene un conjunto de instrucciones para construir una aplicación web de e-commerce con Next.js, ShadCN, Tailwind y Genkit AI. El objetivo es replicar la funcionalidad y el diseño de un proyecto base, permitiendo una personalización rápida para futuros desarrollos.

<!-- TODO: Reemplaza "[NOMBRE_DEL_PROYECTO]" por el nombre del nuevo proyecto en todo el documento. -->

## Sección 1: Branding y Configuración Inicial de la Interfaz

### 1.1 Paleta de Colores y Tema

Configura los colores principales del sitio en `src/app/globals.css`. La paleta debe reflejar la estética de la nueva marca.

**Variables CSS a definir (`:root`):**
<!-- TODO: Reemplaza los valores HSL con la paleta de colores de la nueva marca. -->
- **Background/Foreground:** Un fondo claro con texto oscuro.
- **Panel:** Color para header y footer con texto de alto contraste.
- **Primary:** Color principal para botones y elementos interactivos.
- **Accent:** Un color de acento para llamadas a la acción y elementos destacados.
- **Price:** Un color específico para los precios (opcional).
- **Dark Mode:** Define una paleta de colores complementaria para el modo oscuro.

### 1.2 Tipografía

En `src/app/layout.tsx`, importa y configura las fuentes de Google Fonts deseadas.
<!-- TODO: Reemplaza 'Poppins' y 'Roboto' si la nueva marca requiere tipografías diferentes. -->
- **Poppins:** Para todos los encabezados (`h1`-`h6`).
- **Roboto:** Para el cuerpo del texto.
Configura esto en `tailwind.config.ts` bajo `theme.extend.fontFamily`.

### 1.3 Logo

<!-- TODO: Asegúrate de que el logo esté en la carpeta /public/images/ y actualiza la ruta. -->
Actualiza el componente `src/components/ui/Logo.tsx` para que utilice la imagen del logo ubicada en `[RUTA_AL_LOGO_AQUI]`. Por ejemplo: `/images/nuevo-logo.png`.

### 1.4 Pie de Página (Footer)

Modifica `src/components/layout/Footer.tsx`.
<!-- TODO: Actualiza el nombre y la URL del desarrollador. -->
- El texto debe ser "Desarrollado por [NOMBRE_DESARROLLADOR]".
- La palabra "[NOMBRE_DESARROLLADOR]" debe ser un hipervínculo a `[URL_DESARROLLADOR]`.
- A la izquierda, incluye un ícono SVG relevante.

### 1.5 Botón Flotante de Contacto

En `src/components/layout/FloatingWhatsAppButton.tsx`:
<!-- TODO: Reemplaza con el número de teléfono del nuevo negocio. -->
- Actualiza el `phoneNumber` con el número de WhatsApp correspondiente.

## Sección 2: Contenido Específico de la Página

### 2.1 Página de Inicio (`/`)

En `src/app/(default)/page.tsx`:
<!-- TODO: Adapta los textos del hero section y las características al nuevo negocio. -->
- **Hero Section:** Modifica el eslogan y el texto descriptivo para que se alineen con la marca de `[NOMBRE_DEL_PROYECTO]`.
- **Sección "¿Por Qué Elegirnos?":** Adapta los títulos y descripciones de las tres características principales para reflejar las fortalezas del nuevo e-commerce.

### 2.2 Página de Contacto (`/contact`)

En `src/app/(default)/contact/page.tsx`:
<!-- TODO: Rellena la información de contacto real del nuevo negocio. -->
- **Información de Contacto:** Reemplaza la dirección, email, teléfono y horario de atención con los datos correctos.

### 2.3 API de Contacto

En `src/app/api/contact/route.ts`:
<!-- TODO: Configura el email de destino para los formularios de contacto. -->
- **Email de Destino:** Cambia el valor de `mailTo` a la dirección de correo electrónico que debe recibir las consultas del formulario.

## Sección 3: Lógica del E-commerce y Correcciones Clave

### 3.1 Página de Detalles del Producto (`/products/[productId]`)

Aplica las siguientes correcciones en `src/app/(default)/products/[productId]/page.tsx`:
1.  **Panel de Descripción en Modo Oscuro:** Asegúrate de que el contenedor de la descripción del producto use un color de fondo semántico (`bg-muted`) para que se adapte al modo claro/oscuro.
2.  **Decodificación de Slugs:** Decodifica el `slug` de la URL usando `decodeURIComponent()` antes de pasarlo a la función de consulta a la base de datos (`getProductBySlug`) para manejar correctamente los caracteres especiales.
3.  **Lógica del Zoom de Imagen:** Refactoriza el `useEffect` del zoom para que no dependa de `window.innerWidth` en su array de dependencias. Usa un event listener de `resize` para evitar cuelgues del servidor.
4.  **Botón "Agregar al Carrito":** Confirma que la variante `success` del botón en `src/components/ui/button.tsx` use una clase CSS existente en el tema (`bg-success`).

## Sección 4: Personalización con Inteligencia Artificial

Implementa un sistema de recomendaciones de productos basado en el historial de navegación del usuario.

### 4.1 Seguimiento del Historial del Usuario

En la página de detalles del producto (`/products/[productId]`), usa `localStorage` para guardar los IDs de los productos que el usuario visita (máximo 20).

### 4.2 Flujo de IA para Recomendaciones (Genkit)

Crea el flujo de Genkit en `src/ai/flows/recommend-products-flow.ts`:
- **Directiva:** Usa `'use server'`.
- **Input:** Acepta un `RecommendationRequest` con un array de `viewedProducts`.
- **Output:** Devuelve un `RecommendationResponse` con un `interestSummary` y un array de `recommendedCategorySlugs`.
- **Prompt:**
    <!-- TODO: Adapta los ejemplos de slugs de categoría al nuevo e-commerce. -->
    - El prompt debe instruir a la IA para que actúe como un experto en e-commerce y analice el historial.
    - Los ejemplos de slugs de categoría (ej., 'tazas', 'accesorios-tech') deben ser representativos de las categorías del nuevo proyecto.
- **Exportaciones:** Asegúrate de que los esquemas de Zod **no se exporten**. Solo exporta los tipos inferidos y la función asíncrona principal.

### 4.3 Integración en el Frontend (`RelatedProductsClient.tsx`)

En `src/components/products/RelatedProductsClient.tsx`:
1.  **Obtener Historial:** Lee los IDs de productos desde `localStorage`.
2.  **Llamar a la IA:** Llama al flujo de Genkit con los detalles de los productos vistos.
3.  **Obtener Productos:** Realiza consultas para obtener productos de las categorías recomendadas por la IA y de la categoría actual del producto.
4.  **Mostrar Resultados:** Combina, elimina duplicados y muestra hasta 4 productos relevantes.

## Sección 5: Textos Finales

Aplica los siguientes cambios de texto:
- **Sección de Recomendaciones:** Cambia el título de "También Te Podría Gustar" a "También te podría gustar...".

Siguiendo esta plantilla, podrás recrear y adaptar la aplicación para diferentes proyectos de e-commerce de manera eficiente.
