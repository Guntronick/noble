import { ContactForm } from '@/components/contact/ContactForm';
import type { Metadata } from 'next';
import { Mail, Phone, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us - AI Merch Catalog',
  description: 'Get in touch with AI Merch Catalog.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-headline">Get In Touch</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
          We'd love to hear from you! Whether you have a question about our products, partnerships, or anything else, our team is ready to answer all your questions.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <h2 className="text-3xl font-semibold text-primary font-headline">Contact Information</h2>
          <div className="flex items-start space-x-4">
            <MapPin className="h-8 w-8 text-olive-green mt-1 shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-foreground">Our Office</h3>
              <p className="text-muted-foreground">123 AI Avenue, Tech City, TX 75001</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Mail className="h-8 w-8 text-olive-green mt-1 shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-foreground">Email Us</h3>
              <p className="text-muted-foreground">support@aimerch.com</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Phone className="h-8 w-8 text-olive-green mt-1 shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-foreground">Call Us</h3>
              <p className="text-muted-foreground">+1 (800) 555-AI4U</p>
            </div>
          </div>
           <div className="mt-8 pt-8 border-t">
            <h3 className="text-2xl font-semibold text-primary mb-4 font-headline">Business Hours</h3>
            <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM (CST)</p>
            <p className="text-muted-foreground">Saturday - Sunday: Closed</p>
          </div>
        </div>
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
