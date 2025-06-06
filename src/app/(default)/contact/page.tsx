import { ContactForm } from '@/components/contact/ContactForm';
import type { Metadata } from 'next';
import { Mail, Phone, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contáctanos - Catálogo de Merch IA',
  description: 'Ponte en contacto con Catálogo de Merch IA.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary font-headline">Ponte en Contacto</h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
          ¡Nos encantaría saber de ti! Si tienes alguna pregunta sobre nuestros productos, colaboraciones o cualquier otra cosa, nuestro equipo está listo para responder a todas tus preguntas.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <h2 className="text-3xl font-semibold text-primary font-headline">Información de Contacto</h2>
          <div className="flex items-start space-x-4">
            <MapPin className="h-8 w-8 text-olive-green mt-1 shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-foreground">Nuestra Oficina</h3>
              <p className="text-muted-foreground">123 AI Avenue, Tech City, TX 75001</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Mail className="h-8 w-8 text-olive-green mt-1 shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-foreground">Escríbenos</h3>
              <p className="text-muted-foreground">support@aimerch.com</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Phone className="h-8 w-8 text-olive-green mt-1 shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-foreground">Llámanos</h3>
              <p className="text-muted-foreground">+1 (800) 555-AI4U</p>
            </div>
          </div>
           <div className="mt-8 pt-8 border-t">
            <h3 className="text-2xl font-semibold text-primary mb-4 font-headline">Horario de Atención</h3>
            <p className="text-muted-foreground">Lunes - Viernes: 9:00 AM - 6:00 PM (CST)</p>
            <p className="text-muted-foreground">Sábado - Domingo: Cerrado</p>
          </div>
        </div>
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
