
import { NextResponse, type NextRequest } from 'next/server';
import * as z from 'zod';
import { getProductsByIds } from '@/lib/data';
import type { Product } from '@/lib/types';

// Schema for validating the input from the client
const QuoteItemSchema = z.object({
  id: z.string().uuid(),
  quantity: z.number().int().min(1),
});

const QuoteRequestSchema = z.object({
  items: z.array(QuoteItemSchema),
  formData: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    companyName: z.string().optional(),
    phone: z.string().min(1),
    email: z.string().email(),
    orderNotes: z.string().optional(),
  }),
});


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsedData = QuoteRequestSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ success: false, message: "Datos de entrada inválidos.", errors: parsedData.error.flatten() }, { status: 400 });
    }

    const { items, formData } = parsedData.data;

    // --- Server-Side Validation Step ---
    // 1. Get product IDs from the client request.
    const productIds = items.map(item => item.id);
    if (productIds.length === 0) {
        return NextResponse.json({ success: false, message: "El carrito está vacío." }, { status: 400 });
    }

    // 2. Fetch the *actual* product data from the database. This is the source of truth.
    const productsFromDB = await getProductsByIds(productIds);

    // 3. Verify and calculate the total on the server.
    let serverCalculatedTotal = 0;
    const validatedOrderItems: any[] = [];

    for (const item of items) {
      const product = productsFromDB.find(p => p.id === item.id);

      // If a product from the cart doesn't exist in the DB, reject the request.
      if (!product) {
        return NextResponse.json({ success: false, message: `Producto con ID ${item.id} no encontrado.` }, { status: 404 });
      }

      // If the requested quantity exceeds stock, reject or adjust. For now, we reject.
      if (item.quantity > product.stock) {
        return NextResponse.json({ success: false, message: `Stock insuficiente para ${product.name}.` }, { status: 409 });
      }
      
      const subtotal = product.price * item.quantity;
      serverCalculatedTotal += subtotal;

      validatedOrderItems.push({
        id: product.id,
        name: product.name,
        productCode: product.productCode,
        quantity: item.quantity,
        pricePerUnit: product.price, // Use the price from the DB
        subtotal: subtotal,
      });
    }

    // At this point, `validatedOrderItems` and `serverCalculatedTotal` are secure.
    // We can now proceed with sending an email, saving to a database, etc.

    // For this example, we'll just log the secure, validated data.
    console.log("✅ Pedido validado y procesado en el servidor:");
    console.log("Detalles del Cliente:", formData);
    console.log("Artículos Verificados:", validatedOrderItems);
    console.log("Total Calculado en Servidor: $", serverCalculatedTotal.toFixed(2));
    
    // In a real application, you would integrate with an email service here.
    // e.g., sendEmail({ to: 'admin@noble.com', data: { ... } });

    return NextResponse.json({ success: true, message: "Presupuesto solicitado exitosamente.", orderId: new Date().getTime() });

  } catch (error) {
    console.error("Error procesando la solicitud de presupuesto:", error);
    let errorMessage = "Ocurrió un error inesperado.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
