import { NextResponse, type NextRequest } from 'next/server';
import * as z from 'zod';

// Schema should match the one in ContactForm.tsx
const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10).max(500),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsedData = contactFormSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ success: false, message: "Invalid input.", errors: parsedData.error.flatten() }, { status: 400 });
    }

    const { name, email, phone, message } = parsedData.data;

    // In a real application, you would use an email service (e.g., Nodemailer, SendGrid, Resend)
    // For this example, we'll just log the data and simulate success.
    console.log("Received contact form submission:");
    console.log("Name:", name);
    console.log("Email:", email);
    if (phone) console.log("Phone:", phone);
    console.log("Message:", message);

    // Simulate email sending delay (optional)
    // await new Promise(resolve => setTimeout(resolve, 1000));

    // Pre-configured email address (example)
    const mailTo = process.env.CONTACT_FORM_EMAIL_TARGET || "your-email@example.com";
    console.log(`Simulating email sent to: ${mailTo}`);
    
    // Here you would integrate with your email sending logic:
    // Example (conceptual - does not actually send email):
    // sendEmail({
    //   to: mailTo,
    //   from: email, // Or a fixed "no-reply" address
    //   subject: `New Contact Form Submission from ${name}`,
    //   text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nMessage: ${message}`,
    //   html: `<p><strong>Name:</strong> ${name}</p>...`
    // });

    return NextResponse.json({ success: true, message: "Message sent successfully!" });

  } catch (error) {
    console.error("Error processing contact form:", error);
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
