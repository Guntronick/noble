
"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Send } from 'lucide-react';
import { cn } from "@/lib/utils";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, introduce una dirección de correo electrónico válida." }),
  phone: z.string().optional().refine(value => !value || /^\+?[1-9]\d{1,14}$/.test(value), {
    message: "Por favor, introduce un número de teléfono válido (ej. +1234567890)."
  }),
  message: z.string().min(10, { message: "El mensaje debe tener al menos 10 caracteres." }).max(500, { message: "El mensaje no puede exceder los 500 caracteres." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el mensaje. El servidor devolvió ' + response.status);
      }

      const result = await response.json();

      if (result.success) {
        toast({
          title: "¡Mensaje Enviado!",
          description: "Gracias por contactarnos. Te responderemos pronto.",
        });
        form.reset();
      } else {
        throw new Error(result.message || "Ocurrió un error desconocido.");
      }
    } catch (error) {
      let errorMessage = "Error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // General CTA: Azul Petróleo base, hover Azul Petróleo más oscuro/claro
  const primaryCtaButtonClass = "bg-primary text-primary-foreground hover:bg-primary/90";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-8 rounded-lg shadow-xl">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Nombre Completo</FormLabel>
              <FormControl>
                <Input placeholder="Juan Pérez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Correo Electrónico</FormLabel>
              <FormControl>
                <Input type="email" placeholder="tu@ejemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Número de Teléfono (Opcional)</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Tu Mensaje</FormLabel>
              <FormControl>
                <Textarea placeholder="¿Cómo podemos ayudarte hoy?" rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className={cn("w-full text-lg py-6", primaryCtaButtonClass)} disabled={form.formState.isSubmitting}>
          <Send className="mr-2 h-5 w-5" />
          {form.formState.isSubmitting ? "Enviando..." : "Enviar Mensaje"}
        </Button>
      </form>
    </Form>
  );
}
