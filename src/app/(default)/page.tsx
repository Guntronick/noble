
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const heroLogoHeight = 64;
  const heroLogoWidth = Math.round((600 / 162) * heroLogoHeight); // Assuming original aspect ratio for Noble logo
  const ctaButtonClass = "bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground";

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 text-center rounded-lg overflow-hidden my-8 shadow-xl bg-primary text-primary-foreground"> {/* Fondo Azul Petróleo */}
        <div className="absolute inset-0 opacity-10"> {/* Reducir opacidad para sutilidad sobre azul */}
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
             {/* El logo debe ser blanco o dorado para contrastar */}
            <Logo width={heroLogoWidth} height={heroLogoHeight} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary-foreground font-headline">
            Bienvenido a Noble
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-primary-foreground/80 max-w-2xl mx-auto">
            Descubre diseños únicos y productos tecnológicos de vanguardia.
          </p>
          <Button asChild size="lg" className={cn("px-10 py-6 text-lg", ctaButtonClass)}>
            <Link href="/products">Ver Catálogo</Link>
          </Button>
        </div>
      </section>

      {/* ¿Por Qué Elegirnos? Section */}
      <section className="py-16 bg-background"> {/* Fondo Blanco Humo */}
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground font-headline">¿Por Qué Elegirnos?</h2> {/* Negro Carbón */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-card rounded-lg shadow-md"> {/* Tarjeta Fondo Blanco */}
            {/* Idealmente, reemplazar Image con un componente Icon que pueda tomar color (ej. Lucide icon) */}
            {/* <Icon name="lightbulb" className="text-accent mx-auto mb-4 h-12 w-12" /> */}
            <div className="h-20 w-20 mx-auto mb-4 rounded bg-accent/20 flex items-center justify-center">
                 <span className="text-3xl text-accent">💡</span> {/* Placeholder Icono Dorado Suave */}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground font-headline">Diseños Innovadores</h3> {/* Negro Carbón */}
            <p className="text-muted-foreground">Experimenta productos nacidos de la sinergia entre la creatividad humana y la inteligencia artificial.</p> {/* Gris Grafito */}
          </div>
          <div className="p-6 bg-card rounded-lg shadow-md">
            {/* <Icon name="award" className="text-accent mx-auto mb-4 h-12 w-12" /> */}
             <div className="h-20 w-20 mx-auto mb-4 rounded bg-accent/20 flex items-center justify-center">
                 <span className="text-3xl text-accent">🏆</span> {/* Placeholder Icono Dorado Suave */}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground font-headline">Calidad Premium</h3> {/* Negro Carbón */}
            <p className="text-muted-foreground">Nos aseguramos de que cada artículo cumpla con altos estándares de calidad y fabricación.</p> {/* Gris Grafito */}
          </div>
          <div className="p-6 bg-card rounded-lg shadow-md">
            {/* <Icon name="rocket" className="text-accent mx-auto mb-4 h-12 w-12" /> */}
             <div className="h-20 w-20 mx-auto mb-4 rounded bg-accent/20 flex items-center justify-center">
                 <span className="text-3xl text-accent">🚀</span> {/* Placeholder Icono Dorado Suave */}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground font-headline">Visión de Futuro</h3> {/* Negro Carbón */}
            <p className="text-muted-foreground">Abraza el futuro con nuestra colección de mercancía tecnológica.</p> {/* Gris Grafito */}
          </div>
        </div>
      </section>
    </div>
  );
}
