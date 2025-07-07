
# Guía de Recreación del Proyecto "Noble"

Este documento contiene un conjunto de instrucciones para construir la aplicación web "Noble", un e-commerce con Next.js, ShadCN, Tailwind y Genkit AI. El objetivo es replicar la funcionalidad y el diseño del proyecto actual.

## Sección 1: Branding y Configuración Inicial de la Interfaz

### 1.1 Paleta de Colores y Tema

Configura los colores principales del sitio en `src/app/globals.css`. La paleta debe reflejar una estética moderna y profesional.

**Variables CSS a definir (`:root`):**
- **Background/Foreground:** Un fondo claro (Blanco Humo) con texto oscuro (Negro Carbón).
- **Panel:** El header y footer deben usar un color distintivo (Azul Petróleo) con texto blanco.
- **Primary:** Usa el mismo Azul Petróleo para los elementos primarios.
- **Accent:** Un color cobre o naranja vibrante para llamadas a la acción y elementos destacados.
- **Price:** Un color verde específico para los precios.
- **Dark Mode:** Define una paleta de colores complementaria para el modo oscuro, asegurando que los colores semánticos (`primary`, `accent`, `muted`, etc.) se adapten correctamente.

### 1.2 Tipografía

En `src/app/layout.tsx`, importa y configura las siguientes fuentes de Google Fonts:
- **Poppins:** Para todos los encabezados (`h1`-`h6`).
- **Roboto:** Para el cuerpo del texto.
Configura esto en `tailwind.config.ts` bajo `theme.extend.fontFamily`.

### 1.3 Logo

Actualiza el componente `src/components/ui/Logo.tsx` para que utilice la imagen del logo ubicada en `/public/images/logo-noble.png`.

### 1.4 Pie de Página (Footer)

Modifica `src/components/layout/Footer.tsx`. El texto debe ser "Desarrollado por DenDev".
- La palabra "DenDev" debe ser un hipervínculo a `https://dendev.ar`.
- A la izquierda de "DenDev", incluye un ícono SVG de código (`<>`) para evocar la marca del desarrollador.

## Sección 2: Componentes de UI y Mejoras de Experiencia

### 2.1 Botón de Cambio de Tema (Claro/Oscuro)

En `src/components/layout/ThemeToggleButton.tsx`:
- Implementa una animación de transición fluida al pasar el cursor sobre el botón. Los íconos de sol y luna deben transformarse uno en el otro.
- El ícono del sol (`<Sun />`) debe ser de color amarillo para que sea más intuitivo.

### 2.2 Efectos Hover en Botones

Asegúrate de que todos los botones tengan un efecto `hover` claramente visible. En `src/components/ui/button.tsx`, define estados `hover` que alteren el color de fondo de manera notoria para mejorar la retroalimentación visual.

## Sección 3: Lógica del E-commerce y Correcciones

### 3.1 Página de Detalles del Producto (`/products/[productId]`)

Realiza las siguientes correcciones y mejoras en `src/app/(default)/products/[productId]/page.tsx`:
1.  **Panel de Descripción en Modo Oscuro:** El contenedor de la descripción del producto debe usar un color de fondo semántico (`bg-muted`) en lugar de un color fijo para que se adapte correctamente al modo claro y oscuro.
2.  **Decodificación de Slugs en URL:** Para evitar fallos con productos que tienen caracteres especiales en el nombre (ej., "bolígrafo"), asegúrate de decodificar el `slug` del producto extraído de los parámetros de la URL usando `decodeURIComponent()` antes de pasarlo a la función que consulta la base de datos (`getProductBySlug`).
3.  **Lógica del Zoom de Imagen:** Refactoriza el `useEffect` que gestiona el zoom para que no dependa directamente de `window.innerWidth` en su array de dependencias. Utiliza un event listener de `resize` para recalcular las dimensiones, evitando así cuelgues del servidor de desarrollo de Next.js.
4.  **Botón "Agregar al Carrito":** Asegúrate de que la variante `success` del botón en `src/components/ui/button.tsx` utilice la clase CSS correcta (`bg-success`) para que el botón sea visible.

## Sección 4: Personalización con Inteligencia Artificial

Implementa un sistema de recomendaciones de productos personalizado basado en el historial de navegación del usuario.

### 4.1 Seguimiento del Historial del Usuario

En la página de detalles del producto (`src/app/(default)/products/[productId]/page.tsx`), utiliza `localStorage` para guardar una lista de los IDs de los productos que el usuario visita. Mantén esta lista con un máximo de 20 productos para no sobrecargar el almacenamiento.

### 4.2 Flujo de IA para Recomendaciones (Genkit)

Crea un nuevo flujo de Genkit en `src/ai/flows/recommend-products-flow.ts`:
- **Directiva:** Usa `'use server'`.
- **Input:** El flujo debe aceptar un `RecommendationRequest`, que contiene un array de `viewedProducts` (con `name`, `description`, y `category`).
- **Output:** Debe devolver un `RecommendationResponse`, que contiene:
    - `interestSummary`: Un resumen de una frase sobre los intereses del usuario.
    - `recommendedCategorySlugs`: Un array de hasta 3 slugs de categorías que la IA considera relevantes.
- **Prompt:** El prompt debe instruir a la IA para que actúe como un experto en e-commerce, analice el historial de productos vistos y, basándose en ello, identifique los intereses principales y las categorías más relevantes.
- **Corrección Importante:** Asegúrate de que los esquemas de Zod (Input y Output) **no se exporten** desde este archivo para cumplir con las reglas de `'use server'`. Solo se deben exportar los tipos inferidos y la función asíncrona principal.

### 4.3 Integración en el Frontend

En el componente `src/components/products/RelatedProductsClient.tsx`:
1.  **Obtener Historial:** Al cargar el componente, lee los IDs de los productos vistos desde `localStorage`.
2.  **Llamar a la IA:** Obtén los detalles completos de esos productos y llama al flujo de Genkit `getPersonalizedRecommendations` con esa información.
3.  **Obtener Productos:**
    - Realiza una consulta a la base de datos para obtener productos de las categorías recomendadas por la IA.
    - Realiza otra consulta para obtener productos de la misma categoría que el producto actual (como fallback o complemento).
4.  **Mostrar Resultados:** Combina los resultados de ambas consultas, elimina duplicados y el producto actual, y muestra hasta 4 productos en la sección "También te podría gustar...".

## Sección 5: Textos Finales

Aplica los siguientes cambios de texto:
- **Sección de Recomendaciones:** Cambia el título de "También Te Podría Gustar" a "También te podría gustar...".

Siguiendo estos pasos, se recreará la aplicación "Noble" con todas sus características actuales.
