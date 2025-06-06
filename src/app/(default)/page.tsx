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
            Welcome to AI Merch Catalog
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-primary-foreground/80 max-w-2xl mx-auto">
            Discover unique, AI-generated designs and cutting-edge tech products.
          </p>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-10 py-6 text-lg">
            <Link href="/products">View Catalog</Link>
          </Button>
        </div>
      </section>

      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary font-headline">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-card rounded-lg shadow-md">
            <Image src="https://placehold.co/300x200.png" alt="Innovative Designs" width={300} height={200} className="mx-auto mb-4 rounded data-ai-hint='innovation design'" data-ai-hint="innovation design" />
            <h3 className="text-xl font-semibold mb-2 text-primary font-headline">Innovative Designs</h3>
            <p className="text-foreground/70">Experience products born from the synergy of human creativity and artificial intelligence.</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-md">
            <Image src="https://placehold.co/300x200.png" alt="Quality Products" width={300} height={200} className="mx-auto mb-4 rounded" data-ai-hint="quality material" />
            <h3 className="text-xl font-semibold mb-2 text-primary font-headline">Premium Quality</h3>
            <p className="text-foreground/70">We ensure every item meets high standards of quality and craftsmanship.</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-md">
            <Image src="https://placehold.co/300x200.png" alt="Future Tech" width={300} height={200} className="mx-auto mb-4 rounded" data-ai-hint="futuristic technology" />
            <h3 className="text-xl font-semibold mb-2 text-primary font-headline">Future Forward</h3>
            <p className="text-foreground/70">Embrace the future with our collection of tech-infused merchandise.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
