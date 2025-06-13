
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const heroLogoHeight = 64;
  const heroLogoWidth = Math.round((600 / 162) * heroLogoHeight); 
  // General CTA: Azul Petróleo base, hover Azul Petróleo más oscuro/claro
  const primaryCtaButtonClass = "bg-primary text-primary-foreground hover:bg-primary/90";

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 text-center rounded-lg overflow-hidden my-8 shadow-xl bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-10">
          <Image 
            src="https://placehold.co/1200x600.png" 
            alt="Abstract background" 
            layout="fill" 
            objectFit="cover"
            data-ai-hint="abstract technology lines" 
            priority
          />
        </div>
        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <Logo width={heroLogoWidth} height={heroLogoHeight} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary-foreground font-headline">
            Bienvenido a Noble
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-primary-foreground/80 max-w-2xl mx-auto">
            Descubre diseños únicos y productos tecnológicos de vanguardia.
          </p>
          <Button asChild size="lg" className={cn("px-10 py-6 text-lg", primaryCtaButtonClass)}>
            <Link href="/products">Ver Catálogo</Link>
          </Button>
        </div>
      </section>

      {/* ¿Por Qué Elegirnos? Section */}
      <section className="py-16 bg-background">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground font-headline">¿Por Qué Elegirnos?</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-card rounded-lg shadow-md">
            <div className="h-20 w-20 mx-auto mb-4 rounded bg-accent/20 flex items-center justify-center">
                 <span className="text-3xl text-accent">💡</span> {/* Icono usa --accent (Cobre Oscuro) */}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground font-headline">Diseños Innovadores</h3>
            <p className="text-muted-foreground">Experimenta productos nacidos de la sinergia entre la creatividad humana y la inteligencia artificial.</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-md">
             <div className="h-20 w-20 mx-auto mb-4 rounded bg-accent/20 flex items-center justify-center">
                 <span className="text-3xl text-accent">🏆</span> {/* Icono usa --accent (Cobre Oscuro) */}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground font-headline">Calidad Premium</h3>
            <p className="text-muted-foreground">Nos aseguramos de que cada artículo cumpla con altos estándares de calidad y fabricación.</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-md">
             <div className="h-20 w-20 mx-auto mb-4 rounded bg-accent/20 flex items-center justify-center">
                 <span className="text-3xl text-accent">🚀</span> {/* Icono usa --accent (Cobre Oscuro) */}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground font-headline">Visión de Futuro</h3>
            <p className="text-muted-foreground">Abraza el futuro con nuestra colección de mercancía tecnológica.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
