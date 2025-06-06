import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4">
      <section className="relative py-20 md:py-32 text-center rounded-lg overflow-hidden my-8 shadow-xl bg-gradient-to-br from-primary to-secondary">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="https://placehold.co/1200x600.png" 
            alt="Abstract background" 
            layout="fill" 
            objectFit="cover"
            data-ai-hint="abstract technology" 
            priority
          />
        </div>
        <div className="relative z-10">
          <Logo className="justify-center mb-8 text-primary-foreground" iconSize={64} textSize="text-5xl" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary-foreground font-headline">
            Bienvenido a Catálogo de Merch IA
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-primary-foreground/80 max-w-2xl mx-auto">
            Descubre diseños únicos generados por IA y productos tecnológicos de vanguardia.
          </p>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-10 py-6 text-lg">
            <Link href="/products">Ver Catálogo</Link>
          </Button>
        </div>
      </section>

      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary font-headline">¿Por Qué Elegirnos?</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-card rounded-lg shadow-md">
            <Image src="https://placehold.co/300x200.png" alt="Diseños Innovadores" width={300} height={200} className="mx-auto mb-4 rounded" data-ai-hint="innovation design" />
            <h3 className="text-xl font-semibold mb-2 text-primary font-headline">Diseños Innovadores</h3>
            <p className="text-foreground/70">Experimenta productos nacidos de la sinergia entre la creatividad humana y la inteligencia artificial.</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-md">
            <Image src="https://placehold.co/300x200.png" alt="Productos de Calidad" width={300} height={200} className="mx-auto mb-4 rounded" data-ai-hint="quality material" />
            <h3 className="text-xl font-semibold mb-2 text-primary font-headline">Calidad Premium</h3>
            <p className="text-foreground/70">Nos aseguramos de que cada artículo cumpla con altos estándares de calidad y fabricación.</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-md">
            <Image src="https://placehold.co/300x200.png" alt="Tecnología del Futuro" width={300} height={200} className="mx-auto mb-4 rounded" data-ai-hint="futuristic technology" />
            <h3 className="text-xl font-semibold mb-2 text-primary font-headline">Visión de Futuro</h3>
            <p className="text-foreground/70">Abraza el futuro con nuestra colección de mercancía tecnológica.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
